<?php

namespace App\Http\Controllers;

use App\Models\BaiViet;
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
use App\Models\DaMua;
use App\Models\TheLoai;
use App\Models\YeuThich;
use Carbon\Carbon;
use App\Models\LichSuNap;
use App\Models\ThongTin;
use App\Models\LichSuMua;
use Illuminate\Support\Facades\Log;
use App\Models\LichSuDoc;
use App\Models\BaoCao;
use Illuminate\Support\Facades\DB;
class User_Controller extends Controller
{
    
    public function taiKhoan(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('/');
        }
        $daMua = $user->daMuas()->with('chuong.truyen')->get();
        $subDaMua = [];
        foreach($daMua as $row){
            $chuong = $row->chuong;
            if (!$chuong || !$chuong->truyen) continue;
                $truyenId = $chuong->truyen->id;
                $subDaMua[$truyenId]['truyen'] = $chuong->truyen;
                $subDaMua[$truyenId]['sub'][] = $chuong;
                $subDaMua[$truyenId]['total'] = ($subDaMua[$truyenId]['total'] ?? 0) + $row->gia;
        }
            $user->id=NguoiDung::giaiMa($user->id);
            return Inertia::render('User/TaiKhoan',[
                'user'=> $user,
                'daMua'=>$subDaMua,
                
             
        ]);
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
            'login'=> $user,
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
            'login'=> $user,
        ]);
    }

    public function danhSachTruyenTheLoai(Request $request, $id){
        $user = $request->attributes->get('user');
        $xep = $request->query('sortBy','new');
        $trangThai = $request->query('status','all');
        $soChuong = $request->query('chapterRange','all');
        $page = $request->query('page',1);
        $limit = 20;
        $theLoai = TheLoai::find($id);
        $query = $theLoai->Truyens()
            ->where('trangThai', 1)
            ->with(['Chuongs' => fn($q) => $q->where('trangThai', 1)])
            ->withCount([
                'Chuongs as soLuong' => fn($q) => $q->where('trangThai', 1)
            ])
            ->when($trangThai === 'done', fn($q) => $q->whereNotNull('ngayKetThuc'))
            ->when($trangThai === 'writing', fn($q) => $q->whereNull('ngayKetThuc'));

        $truyens = $query->get()
            ->map(function ($truyen) {
                $truyen->luotXem = $truyen->Chuongs->sum('luotXem');
                return $truyen;
            })
            ->when($soChuong === 'lt50', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong <= 50)->values())
            ->when($soChuong === '50-100', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 50 && $truyen->soLuong <= 100)->values())
            ->when($soChuong === '100-200', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 100 && $truyen->soLuong <= 200)->values())
            ->when($soChuong === '200-500', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 200 && $truyen->soLuong <= 500)->values())
            ->when($soChuong === '500-1000', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 500 && $truyen->soLuong <= 1000)->values())
            ->when($soChuong === 'mr1000', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 1000)->values());
        if($xep == 'new'){
            $truyens = $truyens->sortByDesc('ngayTao')->values();
        }else{
            $truyens = $truyens->sortByDesc( 'luotXem')->values();
        }
        //Phân trang
        $total = $truyens->count();
        $truyens = $truyens->forPage($page, $limit)->values();
        $pageCount = ceil($total / $limit);
        
        return Inertia::render('User/DetailCategory',[
            'truyens'=>$truyens,
            'theLoai'=>$theLoai,
            'user'=> $user,
            'pageCount' => $pageCount,
        ]);
    }

    public function stories(Request $request, $id){
        $user=$request->attributes->get('user');
        if($user)
            $yeuThich = YeuThich::where('id_NguoiDung',$user->id)
                            ->where('id_Truyen',$id)->first();
        else
            $yeuThich=false;
        $truyen = Truyen::with('TheLoai:id,ten')-> find($id);
        $soLuong = $truyen->Chuongs()->count();
        $chuongs = $truyen->Chuongs()->where('trangThai', 1)->select('id','ten','soChuong','gia','ngayTao')->get();
        $truyenDaHoanThanhs = Truyen::where('trangThai', 1)
            ->whereNotNull('ngayKetThuc')
            ->orderByDesc('ngayKetThuc')
            ->take(14)
            ->get();
        if($user){
            if ($truyen->id_NguoiDung === $user->id || $user->vaiTro < 3) {
                $chuongChuaMua = collect(); // Trống
            } else {
                // Lấy ID các chương mà user đã mua
                $chuongIds = $truyen->chuongs->pluck('id');

                $chuongDaMuaIds = DaMua::where('id_NguoiDung', $user->id)
                    ->whereIn('id_Chuong', $chuongIds)
                    ->pluck('id_Chuong');

                // Lấy các chương có phí và chưa mua
                $chuongChuaMua = $truyen->chuongs()
                    ->where('gia', '>', 0)
                    ->whereNotIn('id', $chuongDaMuaIds)
                    ->select('id','ten','soChuong','gia','ngayTao')
                    ->get();
            }
        }else{
            $chuongChuaMua = $truyen->chuongs()
                    ->where('gia', '>', 0)
                    ->get();
        }
        return Inertia::render('User/Stories',[
            'favorite'=>$yeuThich?true:false,
            'truyen'=>$truyen,
            'chuongs'=>$chuongs,
            'login'=>$user,
            'soLuong'=>$soLuong,
            'truyenDaHoanThanhs'=>$truyenDaHoanThanhs,
            'chuongChuaMua'=>$chuongChuaMua,
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
        $chuongs = $truyen->Chuongs()->where('trangThai', 1)->select('id','ten','soChuong','gia','ngayTao')->get();

        $daBaoCao = false;
        if($user){
            $daBaoCao = BaoCao::where('id_NguoiDung',$user->id)->where('id_Chuong',$id)->first();
            $user->premium = $user->vaiTro < 3?true:($user->premium > now() ? true : false);
            if ($truyen->id_NguoiDung === $user->id || $user->vaiTro < 3) {
                $chuongChuaMua = collect(); // Trống
            } else {
                // Lấy ID các chương mà user đã mua
                $chuongIds = $truyen->chuongs->pluck('id');

                $chuongDaMuaIds = DaMua::where('id_NguoiDung', $user->id)
                    ->whereIn('id_Chuong', $chuongIds)
                    ->pluck('id_Chuong');

                // Lấy các chương có phí và chưa mua
                $chuongChuaMua = $truyen->chuongs()
                    ->where('gia', '>', 0)
                    ->whereNotIn('id', $chuongDaMuaIds)
                    ->select('id','ten','soChuong','gia','ngayTao')
                    ->get();
            }
        }else{
            $chuongChuaMua = $truyen->chuongs()
                ->where('gia', '>', 0)
                ->get();
        }
        return Inertia::render('User/DetailStory',[
            'chuong'=>$chuong,
            'truyen'=>$chuong->Truyen,
            'chuongCuoi'=>$chuongCuoi->id==$chuong->id?true:false,
            'idChuongTruoc'=>$chuongTruoc?->id??null,
            'idChuongSau'=>$chuongSau?->id??null,
            'user'=> $user,
            'chuongChuaMua'=>$chuongChuaMua,
            'chuongs'=>$chuongs,
            'daBaoCao'=>$daBaoCao?true:false,
            // ?false
            // :[
            //     'premium'=>$user->vaiTro < 3?true:($user->premium > now() ? true : false),
            //     'id'=>$user->id
            // ]
        ]);
    }
    public function changeYeuThich(Request $request, $id){
        $user=$request->attributes->get('user');
        $yeuThich=YeuThich::where('id_NguoiDung',$user->id)
            ->where('id_Truyen',$id)
            ->first();
        if($yeuThich){
            try{
                YeuThich::where('id_NguoiDung', $user->id)
                    ->where('id_Truyen', $id)
                    ->delete();
                return response()->json(['message'=>'Bỏ yêu thích thành công','flag'=>false],200);
            }catch(Exception $e){
                return response()->json(['message'=>$e->getMessage()],500);
            }
            
        }
        Log::info('6');
        $yeuThich = new YeuThich();
        $yeuThich->id_NguoiDung = $user->id;
        $yeuThich->id_Truyen = $id;
        $yeuThich->save();
        Log::info('7');
        return response()->json(['message'=>'Thêm yêu thích thành công','flag'=>true],200);
    }
    public function checkDaMua(Request $request){
        $daMua = $request->attributes->get('bought');
        return response()->json(['daMua'=>$daMua] ,200);
    }

    public function blogTruyen(Request $request){
        $user=$request->attributes->get('user');
        $blogtruyen=BaiViet::all();
         return Inertia::render('User/BlogStories',[
            'blogTruyen'=>$blogtruyen,
            'login'=>$user,
        ]);
    }
     public function detailBlogTruyen(Request $request, $id){
        $user=$request->attributes->get('user');
        $detailBlog=BaiViet::find($id);
        
         // Lấy 20 bài viết mới nhất, loại trừ bài hiện tại
        $recentBlogs = BaiViet::where('id', '!=', $id)
            ->orderBy('ngayTao', 'desc') 
            ->take(20)
            ->get();

        // Random chọn 5 bài trong số 20 bài mới nhất
        $randomBlogs = $recentBlogs->random(min(5, $recentBlogs->count()));

        return Inertia::render('User/DetailBlogStory', [
            'detailBlog' => $detailBlog,
            'randomBlogs' => $randomBlogs,
            'login'=>$user,
        ]);
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
        $pass = $request->pass;
        if(!$pass){
            return response()->json([
                'message' => 'Xác nhận thành công.'
            ],200);
        }
        $user->email = NguoiDung::maHoa($email);
        $user->matKhau = NguoiDung::maHoa($pass);
        $user->save();

        return response()->json([
            'message' => 'Xác nhận thành công.'
        ],200);
    }

    public function apiCheckEP(Request $request){
        $user = $request->attributes->get('user');
        if (!$user) {
            return response()->json(['message'=>'Chưa đăng nhập'],401);
        }
        if(!$user->email || !$user->matKhau){
            if($user->vaiTro>2)
                return response()->json(['value'=>false],200);
        }
        return response()->json(['value'=>true],200);
    }

    public function signupAuthor(Request $request){
        $user = $request->attributes->get('user');
        if (!$user || !$user->email) {
            return redirect('/');
        }
        if($user->vaiTro < 4){
            return redirect('/author');
        }
        $user->email = NguoiDung::giaiMa($user->email);
        $dieuKhoan = ThongTin::where('khoa','DKTG')->where('trangThai',1)->first();
        return Inertia::render('User/SignupAuthor', [
            'user'=> $user,
            'dieuKhoan' => $dieuKhoan->giaTri
        ]);
    }
    public function apiSignupAuthor(Request $request){
        $user = $request->attributes->get('user');
        if (!$user) {
            return redirect('/');
        }
        try {
            $user->vaiTro = 3;
            $user->save();
            return response()->json(['message'=>'Đăng ký trở thành tác giả thành công!'],200);
        } catch (\Exception $e) {
            return response()->json(['message'=> $e->getMessage()],500);
        }
    }

    public function dieuKhoanDichVu(Request $request){
        $user = $request->attributes->get('user');
        $dkdv = ThongTin::where('khoa','dieuKhoanDichVu')->where('trangThai',1)->first();
        return Inertia::render('User/DieuKhoanDichVu', [
            'user'=> $user,
            'dieuKhoanDichVu'=> $dkdv->giaTri
        ]);
    }
    public function apiMuaChuong(Request $request){
        try{
        $user = $request->attributes->get('user');
        if (!$user) {
            return response()->json(['message'=> 'Chưa đăng nhập!'],401);
        }
        $nguoiDung = NguoiDung::find($user->id);
        $chuongMuas = $request->input('chuongMuas');
        if (!is_array($chuongMuas) || empty($chuongMuas)) {
            return response()->json(['message' => 'Danh sách chương mua không hợp lệ'], 400);
        }
        $chuongIds = collect($chuongMuas)->pluck('id')->toArray();

        $chuongs = Chuong::whereIn('id', $chuongIds)->get()->keyBy('id');
        $daMuaIds = DaMua::where('id_NguoiDung', $user->id)->pluck('id_Chuong')->toArray();

        $truyen = $chuongs->first()->Truyen;
        $chuongCuoi = $truyen->chuongs->where('trangThai', 1)->sortByDesc('soChuong')->first();

        $giamGia = false;
        $tongGia = 0;

        foreach ($chuongMuas as $item) {
            $id = $item['id'];
            if (in_array($id, $daMuaIds)) {
                return response()->json(['message' => "Bạn đã mua chương '{$item['soChuong']}' trước đó."], 400);
            }
            if ($id == $chuongCuoi->id) {
                $giamGia = true;
            }
            $tongGia += $chuongs[$id]->gia;
        }

        $tongGiaG = $giamGia ? ceil($tongGia * 0.9) : $tongGia;

        if ($nguoiDung->soDu < $tongGiaG) {
            return response()->json(['soDu' => 'Không đủ xu trong tài khoản!'], 400);
        }

        // Trừ tiền
        $nguoiDung->soDu -= $tongGiaG;
        $nguoiDung->save();

        // Lưu lịch sử
        $lichSuMua = LichSuMua::create([
            'id_NguoiDung' => $user->id,
            'thoiGian' => now(),
            'gia' => $tongGiaG
        ]);

        // Lưu đã mua
        foreach ($chuongs as $chuong) {
            DaMua::create([
                'id_NguoiDung' => $user->id,
                'id_LichSuMua' => $lichSuMua->id,
                'id_Chuong' => $chuong->id,
                'gia' => $chuong->gia
            ]);
        }

        // Trả tiền tác giả
        $tacGia = NguoiDung::find($truyen->id_NguoiDung);
        $tacGia->soDu += floor($tongGia * 0.7);
        $tacGia->save();

        return response()->json([
            'message' => 'Mua thành công!',
            'soDuConLai' => $nguoiDung->soDu,
            'chuongDaMua' => $chuongIds
        ], 200);
        }catch(Exception $e){
            return response()->json(['message'=>$e->getMessage()], 400);
        }
    }
    public function apiCheckPass(Request $request){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['taiKhoan'=> 'Chưa đăng nhập!'],401);
        $pass = $request->input('pass');
        if($user->matKhau != NguoiDung::maHoa($pass))
            return response()->json(['matKhau'=> 'Mật khẩu không chính xác!'],401);
        return response()->json(['message'=> 'Xác thực thành công!'],200);
    }

    public function apiGetTomTat(Request $request,$id){
        $daMua = $request->attributes->get('bought');
        if(!$daMua) return response()->json(['message'=> 'Chỉ có thể xem tóm tắt những chương đã mua!'],200);
        $chuong = Chuong::find($id);
        return response()->json(['message'=> $chuong->tomTat],200);
    }

    public function apiLichSuDoc(Request $request,$id){
        try{
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=> 'Chưa đăng nhâp!'],401);
        $chuong = Chuong::find($id);
        if(!$chuong) return response()->json(['message'=> 'Chương không hợp lệ!'],401);
        $lichSuDoc = LichSuDoc::where('id_NguoiDung',$user->id)->where('id_Chuong',$id)->first();
        if(!$lichSuDoc){
            $lichSuDoc = new LichSuDoc();
            $lichSuDoc->id_NguoiDung = $user->id;
            $lichSuDoc->id_Chuong = $id;
            $lichSuDoc->thoiGian = now();
            $lichSuDoc->save();
            $chuong->luotXem+=1;
            $chuong->save();
            Log::info('Thêm lịch sử đọc');
            return response()->json(['message'=> 'Thêm lịch sử đọc thành công!'],200);
        }
        $lichSuDoc->thoiGian = now();
        $lichSuDoc->save();
        Log::info('Cập nhật lịch sử đọc');
        return response()->json(['message'=> 'Cập nhật lịch sử đọc thành công!'],200);
        }catch(Exception $e){
            Log::error($e->getMessage());
        }
    }
    public function datLaiMatKhau(Request $request){
        $user = $request->attributes->get('user');
        if (!$user || !$user->email) {
            return redirect('/');
        }
        $user->email = NguoiDung::giaiMa($user->email);
        return Inertia::render('User/DatLaiMatKhau', [
            'user'=> $user,
        ]);
    }
    public function apiGetDaMuas(Request $request,$page){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=>'Chưa đăng nhập!'],401);
        $limit = 10;
        $hasMore = true;
        $offset = ($page - 1) * $limit;
        $daMuas = $user->daMuas()
                ->with('chuong.truyen')
                ->get()
                ->filter(fn($row) => $row->chuong && $row->chuong->truyen) // loại bỏ null
                ->sortBy(fn($row) => $row->chuong->soChuong) // sắp xếp theo số chương
                ->slice($offset, $limit) // phân trang thủ công
                ->values();
        if($daMuas->count() < $limit)
            $hasMore = false;
        $subDaMuas = [];
        foreach($daMuas as $row){
            $chuong = $row->chuong;
            if (!$chuong || !$chuong->truyen) continue;
                $truyenId = $chuong->truyen->id;
                $subDaMuas[$truyenId]['truyen'] = $chuong->truyen;
                $subDaMuas[$truyenId]['sub'][] = $chuong;
                $subDaMuas[$truyenId]['total'] = ($subDaMuas[$truyenId]['total'] ?? 0) + $row->gia;
        }
        return response()->json([
            'daMuas' => $subDaMuas,
            'hasMore' => $hasMore
        ],200);
    }

    public function apiGetYeuThichs(Request $request, $page){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=>'Chưa đăng nhập!'],401);
        $limit = 10;
        $offset = ($page - 1) * $limit;
        $query = $user->yeuThichTruyens()->orderBy('ten');
        $total = $query->count();
        $truyens = $query->skip($offset)->take($limit)->get();
        return response()->json([
            'yeuThichs' => $truyens,
            'hasMore' => ($offset + $limit) < $total,
        ],200);
    }

    public function apiGetLichSus(Request $request){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=>'Chưa đăng nhập!'],401);
        $lastTime = $request->query('lastTime');
        $limit = 10;
        $queryBuilder = function ($model, array $with = []) use ($user, $lastTime, $limit) {
            return $model::with($with)
                ->where('id_NguoiDung', $user->id)
                ->when($lastTime, fn($q) => $q->where('thoiGian', '<', $lastTime))
                ->orderByDesc('thoiGian')
                ->take($limit)
                ->get();
        };

        $doc = $queryBuilder(LichSuDoc::class, ['chuong.truyen'])
            ->map(fn($r) => [
                'loai' => 1,
                'thoiGian' => $r->thoiGian,
                'lichSu' => $r,
                'tenChuong' => $r->chuong?->ten,
                'soChuong' => $r->chuong?->soChuong,
                'truyen' => $r->chuong?->truyen
            ]);

        $nap = $queryBuilder(LichSuNap::class)->map(fn($r) => [
            'loai' => 2,
            'thoiGian' => $r->thoiGian,
            'lichSu' => $r
        ]);

        // $mua = LichSuMua::with('daMuas.chuong.truyen')
        // ->where('id_NguoiDung', $user->id)
        // ->when($lastTime, fn($q) => $q->where('thoiGian', '<', $lastTime))
        // ->orderByDesc('thoiGian')
        // ->take($limit)
        // ->get()
        // ->map(fn($r) => [
        //     'loai' => 3,
        //     'thoiGian' => $r->thoiGian,
        //     'lichSu' => $r,
        //     'sub' => $r->daMuas
        //         ->map(fn($dm) => $dm->chuong)
        //         ->filter()
        //         ->sortBy('soChuong') // Sắp xếp theo số chương tăng dần
        //         ->values(),
        //     'truyen' => $r->daMuas
        //                 ->map(fn($dm) => $dm->chuong?->truyen)
        //                 ->filter()
        //                 ->first(),
        // ]);
        $mua = LichSuMua::with('daMuas.chuong.truyen')
        ->where('id_NguoiDung', $user->id)
        ->when($lastTime, fn($q) => $q->where('thoiGian', '<', $lastTime))
        ->orderByDesc('thoiGian')
        ->take($limit)
        ->get()
        ->map(fn($r) => [
            'loai' => 3,
            'thoiGian' => $r->thoiGian,
            'lichSu' => $r,
            'sub' => $r->daMuas->map(fn($dm) => $dm->chuong)->filter()->values(),
            'soLuong' => $r->daMuas->count(),
            'truyen' => $r->daMuas
                        ->map(fn($dm) => $dm->chuong?->truyen)
                        ->filter()
                        ->first(),
            'tacGia' => optional($r->daMuas
                        ->map(fn($dm) => $dm->chuong?->truyen?->nguoiDung)
                        ->filter()
                        ->first())->ten,
        ]);

        // Gộp, sắp xếp lại
        $all = $doc->concat($nap)->concat($mua)
            ->sortByDesc('thoiGian')
            ->values();

        // Cắt lại đúng limit nếu nhiều hơn
        $result = $all->take($limit);
        $minTime = $result->last()['thoiGian'] ?? null;

        return response()->json([
            'lichSus' => $result,
            'hasMore' => $all->count() > $limit,
            'minTime' => $minTime
        ]);

    }
    public function apiDoiTen(Request $request){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=>'Chưa đăng nhập!'],401);
        $ten = $request->ten;
        $user->ten=$ten;
        $user->save();
        return response()->json(['message'=>'Đổi tên thành công!'],200);
    }
    public function apiBaoCaoChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user) return response()->json(['message'=>'Chưa đăng nhập!'],401);

        $chuong = Chuong::find($id);
        if(!$chuong) return response()->json(['message'=>'Không tìm thấy chương muốn báo cáo!'],401);

        $lichSuDoc = LichSuDoc::where('id_NguoiDung',$user->id)->where('id_Chuong',$chuong->id)->first();
        if(!$lichSuDoc) return response()->json(['message'=>'Nghi vẫn bạn chưa đọc kỹ chương này!'],401);

        $baoCao = BaoCao::where('id_NguoiDung',$user->id)->where('id_Chuong',$chuong->id)->first();
        if($baoCao) return response()->json(['message'=>'Bạn đã từng báo cáo chương này!'],401);
        $noiDung = $request->noiDung;
        $baoCao = new BaoCao();
        $baoCao->id_NguoiDung = $user->id;
        $baoCao->id_Chuong = $id;
        $baoCao->trangThai = 1;
        $baoCao->noiDung = $noiDung;
        $baoCao->save();
        return response()->json(['message'=>'Báo cáo thành công!'],200);
    }
    public function timKiem(Request $request){
        $user = $request->attributes->get('user');
        $xep = $request->query('sortBy','new');
        $searchText = $request->query('searchText', "");
        $trangThai = $request->query('status','all');
        $soChuong = $request->query('chapterRange','all');
        $page = $request->query('page',1);
        $limit = 30;
        $query = Truyen::where(DB::raw('LOWER(ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
            ->where('trangThai', 1)
            ->with('theLoai:id,ten')
            ->with(['Chuongs' => fn($q) => $q->where('trangThai', 1)])
            ->withCount([
                'Chuongs as soLuong' => fn($q) => $q->where('trangThai', 1)
            ])
            ->when($trangThai === 'done', fn($q) => $q->whereNotNull('ngayKetThuc'))
            ->when($trangThai === 'writing', fn($q) => $q->whereNull('ngayKetThuc'));

        $truyens = $query->get()
            ->map(function ($truyen) {
                $truyen->luotXem = $truyen->Chuongs->sum('luotXem');
                return $truyen;
            })
            ->when($soChuong === 'lt50', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong <= 50)->values())
            ->when($soChuong === '50-100', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 50 && $truyen->soLuong <= 100)->values())
            ->when($soChuong === '100-200', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 100 && $truyen->soLuong <= 200)->values())
            ->when($soChuong === '200-500', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 200 && $truyen->soLuong <= 500)->values())
            ->when($soChuong === '500-1000', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 500 && $truyen->soLuong <= 1000)->values())
            ->when($soChuong === 'mr1000', fn($collection) => $collection->filter(fn($truyen) => $truyen->soLuong >= 1000)->values());
        if($xep == 'new'){
            $truyens = $truyens->sortByDesc('ngayTao')->values();
        }else{
            $truyens = $truyens->sortByDesc( 'luotXem')->values();
        }
        //Phân trang
        $total = $truyens->count();
        $truyens = $truyens->forPage($page, $limit)->values();
        $pageCount = ceil($total / $limit);
        
        return Inertia::render('User/TimKiem',[
            'truyens'=>$truyens,
            'user'=> $user,
            'pageCount' => $pageCount,
        ]);
    }
}
