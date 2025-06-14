<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use App\Models\NguoiDung;
use App\Services\JwtService;
use App\Models\Truyen;
use App\Models\Chuong;

class User_Controller extends Controller
{
    public function index(Request $request){
        $user = $request->attributes->get('user');
        return Inertia::render('User/Home',['login'=> $user?true:false]);
    }
    public function taiKhoan(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('/');
        }
        return Inertia::render('User/TaiKhoan');
    }
//////////////////////////////////////////////////////////////
    public function LoginFB( Request $request){
        $redirectUrl = $request->query('redirect', url('/'));
        session(['login_redirect' => $redirectUrl]);
        return Socialite::driver(driver: 'facebook')->redirect();
    }

    public function LoginFBCallback( Request $request, JwtService $jwtService ){
        try {
            $fbUser = Socialite::driver('facebook')->stateless()->user();
            $idMaHoa = NguoiDUng::maHoa('F' . $fbUser->getId());

            $user = NguoiDung::firstOrCreate(['id' => $idMaHoa], [
                'id' => $idMaHoa,
                'ten' => $fbUser->getName(),
                'vaiTro' => 4,
                'anhDaiDien'=> $fbUser->getAvatar(),
                'ngayTao'=> now(),
                
            ]);

            $token = $jwtService->generateToken('F' . $fbUser->getId());
            return redirect('http://localhost:8000/auth/callback?token='. $token);
            
        }catch (Exception $e){
            return Inertia::render('User/Home',['user'=>$e->getMessage()]);
        }
    }

     public function LoginGG(Request $request)
    {
        $redirectUrl = $request->query('redirect', url('/'));
        session(['login_redirect' => $redirectUrl]);
        return Socialite::driver('google')->with(['prompt' => 'select_account'])->redirect();
    }

     public function LoginGGCallback( Request $request, JwtService $jwtService ){
        try {
            $ggUser = Socialite::driver('google')->stateless()->user();
            $idMaHoa = NguoiDUng::maHoa('G' . $ggUser->getId());
            $user = NguoiDung::firstOrCreate(['id' => $idMaHoa], [
                'id' => $idMaHoa,
                'ten' => $ggUser->getName(),
                'vaiTro' => 4,
                'anhDaiDien'=> $ggUser->getAvatar(),
                'ngayTao'=> now(),
            ]);

            $token = $jwtService->generateToken('G' . $ggUser->getId());
            $redirectUrl = session('login_redirect',url('/'));
            session()->flash('loginf',true);
            return Inertia::location($redirectUrl)
            ->withCookie(
                cookie(
                    'auth_token',
                    $token,
                    60 * 24 * 7, // 7 ngày
                    '/',
                    null,
                    true,
                    true,
                    false,
                    'Strict'
                )
            );
        }catch (Exception $e){
            return Inertia::render('User/Home',['user'=>$e->getMessage()]);
        }
    }



    public function authCallback( Request $request){
        $token = $request->query('token');
        $redirectUrl = session('login_redirect',url('/'));
        session()->flash('loginf',true);
        return Inertia::location($redirectUrl)
        ->withCookie(
            cookie(
                'auth_token',
                $token,
                60 * 24 * 7, // 7 ngày
                '/',
                null,
                true,
                true,
                false,
                'Strict'
            )
        );
    }

    public function logout( Request $request ){
        return Inertia::location('/')
        ->withCookie(
            cookie(
                'auth_token', 
                '',
                -1,
                '/', 
                null,
                true, 
                true, 
                false, 
                'Strict'));
    }
    public function category(){
        return Inertia::render('User/TheLoai');
    }


    public function danhSachTruyenTheLoai(Request $request, $id){
        return Inertia::render('User/DetailCategory');
    }

    public function stories(Request $request, $id){
        $truyen=Truyen::find($id);
        // if(!$truyen){
        //     return abort(404);
        // }
        $chuongs = null; //tam
        // $chuongs = $truyen->Chuongs(); 
        return Inertia::render('User/Stories',['truyen'=>$truyen,'chuongs'=>$chuongs]);
    }
    public function detailStory(Request $request, $id){
        $chuong = Chuong::find($id); //tam
        // $chuongs = $truyen->Chuongs(); 
        return Inertia::render('User/DetailStory',['chuong'=>$chuong]);
    }

}
