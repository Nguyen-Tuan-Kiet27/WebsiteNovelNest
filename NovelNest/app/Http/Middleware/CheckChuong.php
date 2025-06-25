<?php

namespace App\Http\Middleware;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\NguoiDung;
use App\Models\DaMua;
use App\Models\Chuong;
class CheckChuong
{
    public function handle(Request $request, Closure $next): Response
    {
        $jwtService = app(JwtService::class);
        $token = $request->cookie('auth_token');
        $parsed = false;
        if ($token) $parsed = $jwtService->parseToken($token);
        $uid = $parsed->claims()->get('uid');
        $chuong = Chuong::find($request->route('id'));
        if (!$chuong || $chuong->trangThai == 0) {
            abort(404,'Chương này không tồn tại!');
        }
        if($chuong->gia == 0) {
            $request->attributes->set('bought',true);
            return $next($request);
        }
        if (!$token || !$parsed) {
            $request->attributes->set('bought',false);
            return $next($request);
        }
        $daMua = DaMua::where('id_NguoiDung',$uid)->where('id_Chuong',$chuong->id)->first();
        if (!$daMua) {
            $request->attributes->set('bought',false);
            return $next($request);
        }
        $request->attributes->set('bought',true);
        return $next($request);
    }
}
