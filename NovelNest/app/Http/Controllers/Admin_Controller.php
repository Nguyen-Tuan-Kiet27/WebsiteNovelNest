<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Exception;
use App\Services\JwtService;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Crypt;

class Admin_Controller extends Controller
{
    public function login(Request $request){
        $user = $request->attributes->get('user');
        if($user->vaiTro < 3){
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
}
