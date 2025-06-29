<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Exception;
use App\Services\JwtService;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Crypt;
use App\Models\TheLoai;

class Admin_Controller extends Controller
{
    public function login(Request $request){
        $user = $request->attributes->get('user');
        if($user && $user->vaiTro < 3){
            return Inertia::location('/admin');
        }
        return Inertia::render('Admin/Login');
    }

    public function authLogin(Request $request, JwtService $jwtService){
        $tenDangNhap = $request->input('tenDangNhap');
        $matKhau = $request->input('matKhau');
        $user = NguoiDung::where('tenDangNhap',NguoiDung::maHoa($tenDangNhap))
            ->where('matKhau',NguoiDung::maHoa($matKhau))
            ->first();
        if(!$user){
            return response()->json(['message'=>"Tên đăng nhập hoặc mật khẩu không chính xác"],401);
        }
        $id = NguoiDung::giaiMa($user->id);
        $token = $jwtService->generateToken($id);
        return response()->json(["message"=> "Đăng nhập thành công"],200)
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
                'strict'
            )
        );
        // $token = $request->cookie('auth_token');
        // $parsed = $jwtService->parseToken($token);
        // return response()->json(['message'=> NguoiDung::find(NguoiDung::maHoa($parsed->claims()->get('uid')))],401);

    }

    public function dashboard(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        return Inertia::render('Admin/DashBoard',['user'=> $user]);
    }

    public function quanlytruyen(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        return Inertia::render('Admin/QuanLyTruyen', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ]
        ]);
    }

    public function themtheloai(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        return Inertia::render('Admin/ThemTheLoai', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
        ]);
    }
    public function apiThemTheLoai(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $ten = $request->input('ten');
        $theLoai = TheLoai::where('ten',$ten )->first();
        if($theLoai){
            return response()->json([
                'message' => 'Tên thể loại đã tồn tại!'
            ],409);
        }
        if($request->hasFile('hinhAnh')){
            $file = $request->file('hinhAnh');
            $fileName = uniqid() .'.'. $file->getClientOriginalExtension(); 
            $file->move(public_path('img/theLoai/'), $fileName);
        }
        try {
            $theloai = new TheLoai();
            $theloai->ten = $ten;
            $theloai->hinhAnh = $fileName;
            $theloai->trangThai = 1;
            $theloai->save();
        }catch(Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Tạo thể loại mới thành công!'
        ],201);
    }
}
