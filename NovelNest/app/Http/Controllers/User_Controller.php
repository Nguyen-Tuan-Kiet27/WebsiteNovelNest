<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Exception;
use App\Models\NguoiDung;
use App\Services\JwtService;
use App\Models\Truyen;
use App\Models\Chuong;
use App\Models\TheLoai;
use Carbon\Carbon;
use App\Models\LichSuNap;
use Illuminate\Support\Facades\Log;

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
        $chuong = Chuong::where('id', $id)
            ->where('trangThai', 1)
            ->first();
        if(!$request->attributes->get('bought')){
            return redirect('/truyen/'. $chuong->id_Truyen);
        }
        $user=$request->attributes->get('user');
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
            'user'=> !$user
            ?false
            :[
                'premium'=>$user->vaiTro < 3?true:($user->premium > now() ? true : false),
                'id'=>$user->id
            ]
        ]);
    }
    public function checkDaMua(Request $request){
        $daMua = $request->attributes->get('bought');
        return response()->json(['daMua'=>$daMua] ,200);
    }

    public function apiCheckRole(Request $request){
        $user = $request->attributes->get('user');
        if(!$user)
           return response()->json(['message'=>'Chưa đăng nhập'],401);
        return response()->json(['role'=>$user->vaiTro] ,200);    
    }

    public function muaXu(Request $request){
        $user = $request->attributes->get('user');
        if(!$user)
            $user = session('user') ?? null;
        if(!$user) redirect('/');
        return Inertia::render('User/MuaXu',[
            'user'=>$user,
            'pay'=>session('pay') | null,
        ]);
    }

    public function sendOtpEmail(Request $request)
    {
        try{
        $request->validate([
            'email' => 'required|email'
        ]);
        $user = $request->attributes->get('user');
        //Kiểm tra thời gian chờ
        $checkTime = Cache::get('otp_sent_' . $user->id);

        if ($checkTime) {
            $remaining = Carbon::parse($checkTime)->diffInSeconds(now(), false);
            if ($remaining > 0) {
                return response()->json(['time' => 60-$remaining], 429);
            }
        }
        //Tạo thời gian chừo
        Cache::put('otp_sent_' . $user->id, now(), now()->addSeconds(60));

        $email = $request->email;
        $otp = rand(100000, 999999); // Mã OTP 6 chữ số
        // $otp = 111111; // Mã OTP 6 chữ số

        // Lưu OTP vào Cache trong 5 phút
        Cache::put("otp_" . $user->id, ['otp' => $otp, 'email' => $email], now()->addMinutes(5));


        // Gửi email
        Mail::raw("Mã xác nhận của $user->ten là: $otp", function ($message) use ($email) {
            $message->to($email)
                    ->subject('Mã xác nhận từ NovelNest');
        });

        return response()->json([
            'message' => 'Đã gửi mã xác thực đến email.'
        ],200);
        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 429);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6'
        ],
        [
            'otp.digits' => 'Mã xác thực phải đủ 6 chữ số!',
            'otp.required' => 'Vui lòng nhập mã xác thực.'
        ]);
        $user = $request->attributes->get('user');
        $email = $request->email;
        $inputOtp = $request->otp;
        $pass = $request->pass;
        $cachedOtp = Cache::get("otp_" . $user->id);

        if (!$cachedOtp) {
            return response()->json([
                'message' => 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.'
            ], 410); // 410 Gone
        }

        if ($inputOtp != $cachedOtp['otp'] || $cachedOtp['email'] != $email) {
            return response()->json([
                'message' => 'Mã xác nhận không đúng.'
            ], 422);
        }

        // Xác minh thành công
        Cache::forget("otp_" . $user->id); // Xoá mã sau khi dùng

        $user->email = NguoiDung::maHoa($email);
        $user->matKhau = NguoiDung::maHoa($pass);
        $user->save();

        return response()->json([
            'message' => 'Xác nhận thành công.'
        ],200);
    }

    

}
