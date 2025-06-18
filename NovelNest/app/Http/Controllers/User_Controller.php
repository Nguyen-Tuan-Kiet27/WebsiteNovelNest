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
use App\Models\TheLoai;

class User_Controller extends Controller
{
    
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
    public function index(Request $request){
        $user = $request->attributes->get('user');
        $theLoais = TheLoai::where('trangThai', 1)->get();
        $truyenHots = Truyen::with(['Chuongs' => function($query) {
                $query->where('trangThai', 1);
            }])
            ->where('trangThai', 1)
            ->get()
            ->map(function($truyen) {
                $truyen->tongLuotXem = $truyen->Chuongs->sum('luotXem');
                return $truyen;
            })
            ->sortByDesc('tongLuotXem')
            ->take(14)
            ->values();
        $truyenMois = Truyen::where('trangThai', 1)
            ->orderByDesc('ngayBatDau')
            ->take(10)
            ->get();
        $truyenDaHoanThanhs = Truyen::where('trangThai', 1)
            ->whereNotNull('ngayKetThuc')
            ->orderByDesc('ngayKetThuc')
            ->take(14)
            ->get();
        return Inertia::render('User/Home',[
            'login'=> $user?true:false,
            'theLoais'=> $theLoais,
            'truyenHots' => $truyenHots,
            'truyenMois' => $truyenMois,
            'truyenDaHoanThanhs' => $truyenDaHoanThanhs,
        ]);
    }
    public function category(Request $request){
        $user = $request->attributes->get('user');
        $theLoais = TheLoai::withCount([
            'Truyens as soLuongTruyen' => function ($query) {
                $query->where('trangThai', 1);
            }
        ])
        ->where('trangThai', 1)
        ->get();
        return Inertia::render('User/TheLoai',[
            'theLoais' => $theLoais,
            'login'=> $user?true:false,
        ]);
    }

    public function danhSachTruyenTheLoai(Request $request, $id){
        $theLoai = TheLoai::find($id);
        $truyens = $theLoai->Truyens()
            ->where('trangThai', 1)
            ->with(['Chuongs' => function ($query) {
                $query->where('trangThai', 1);
            }])
            ->get()
            ->map(function ($truyen) {
                $truyen->luotXem = $truyen->Chuongs->sum('luotXem');
                return $truyen;
            });
        return Inertia::render('User/DetailCategory',[
            'truyens'=>$truyens,
            'theLoai'=>$theLoai,
        ]);
    }

    public function stories(Request $request, $id){
        $user=$request->attributes->get('user');
        $truyen = Truyen::with('TheLoai:id,ten')-> find($id);
        $soLuong = $truyen->Chuongs()->count();
        $chuongs = $truyen->Chuongs()->where('trangThai', 1)->get();
        $truyenDaHoanThanhs = Truyen::where('trangThai', 1)
            ->whereNotNull('ngayKetThuc')
            ->orderByDesc('ngayKetThuc')
            ->take(14)
            ->get();
        return Inertia::render('User/Stories',[
            'truyen'=>$truyen,
            'chuongs'=>$chuongs,
            'login'=>$user?true:false,
            'soLuong'=>$soLuong,
            'truyenDaHoanThanhs'=>$truyenDaHoanThanhs,
        ]);
    }
    public function detailStory(Request $request, $id){
        $user=$request->attributes->get('user');
        $chuong = Chuong::where('id', $id)
            ->where('trangThai', 1)
            ->first();
        $truyen = $chuong->Truyen;
        $chuongCuoi = $truyen->Chuongs()->orderByDesc('ngayTao')->first();
        $chuongTruoc=$truyen->Chuongs()->where('soChuong',$chuong->soChuong - 1)->first();
        $chuongSau=$truyen->Chuongs()->where('soChuong',$chuong->soChuong + 1)->first();
        return Inertia::render('User/DetailStory',[
            'chuong'=>$chuong,
            'truyen'=>$chuong->Truyen,
            'chuongCuoi'=>$chuongCuoi->id==$chuong->id?true:false,
            'idChuongTruoc'=>$chuongTruoc?->id??null,
            'idChuongSau'=>$chuongSau?->id??null,

        ]);
    }

}
