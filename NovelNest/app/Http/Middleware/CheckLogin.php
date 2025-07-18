<?php

namespace App\Http\Middleware;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckLogin
{
    public function handle(Request $request, Closure $next,...$roles): Response
    {
        $jwtService = app(JwtService::class);
        $token = $request->cookie('auth_token');
        $parsed = false;
        if ($token) $parsed = $jwtService->parseToken($token);
        if (!$token || !$parsed) {
            $request->attributes->set('user',false);
            return $next($request);
        }
        // $user = NguoiDung::where('id',NguoiDung::maHoa($parsed->claims()->get('uid')))
        //         ->where('trangThai',1)->first();
        $user = NguoiDung::where('id',NguoiDung::maHoa($parsed->claims()->get('uid')))->first();
        if(!$user){
            $request->attributes->set('user',false);
            return $next($request);
        }
        if($user->trangThai == 0){
            session()->flash('block','Tài khoản đã bị khóa vì: '.$user->lyDo);
            $request->attributes->set('user',false);
            return redirect()->back()->withCookie(
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
        if($user->vaiTro < 3 && $user->matKhau != $parsed->claims()->get('matKhau')){
            $request->attributes->set('user',false);
            return $next($request);
        }
        if((!empty($roles) && !in_array($user->vaiTro, $roles))){
            if(max($roles) < 3){
                return redirect('/admin/dangnhap');
            }
            return redirect('/');
        }
        // Auth::login($user);
        $request->attributes->set('user', $user);
        return $next($request);
    }
}
