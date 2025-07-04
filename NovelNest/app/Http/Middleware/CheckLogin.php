<?php

namespace App\Http\Middleware;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\NguoiDung;
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
        $user = NguoiDung::where('id',NguoiDung::maHoa($parsed->claims()->get('uid')))
                ->where('trangThai',1)->first();
        if(!$user){
            $request->attributes->set('user',false);
            return $next($request);
        }
        if((!empty($roles) && !in_array($user->vaiTro, $roles))){
            if(max($roles) < 3){
                return redirect('/admin/dangnhap');
            }
            return redirect('/');
        }
        $request->attributes->set('user', $user);
        return $next($request);
    }
}
