<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthJwt
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('auth_token');

        if (!$token) {
            return response()->json(['error' => 'Chưa đăng nhập'], 401);
        }

        $jwtService = app(JwtService::class);
        $parsed = $jwtService->parseToken($token);

        if (!$parsed) {
            return response()->json(['error' => 'Token không hợp lệ'], 401);
        }

        $request->attributes->set('user_id', $parsed->claims()->get('uid'));

        return $next($request);
    }
}
