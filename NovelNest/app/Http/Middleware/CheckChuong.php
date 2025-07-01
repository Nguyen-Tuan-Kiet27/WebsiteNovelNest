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
        $user = $request->attributes->get("user");
        $chuong = Chuong::find($request->route('id'));
        //Chương không tồn tại
        if (!$chuong || $chuong->trangThai == 0) {
            abort(404,'Chương này không tồn tại!');
        }
        //Chưa đăng nhập
        if (!$user) {
            // miễn phí
            if ($chuong->gia == 0) {
                $request->attributes->set('bought', true);
            } else {
                $request->attributes->set('bought', false);
            }
            return $next($request);
        }

        // Nếu là tác giả hoặc miễn phí hoặc admin
        if ($chuong->gia == 0 || $chuong->truyen->id_NguoiDung == $user->id || $user->vaiTro < 3) {
            $request->attributes->set('bought', true);
            return $next($request);
        }
        //Nếu đã mua
        $daMua = DaMua::where('id_NguoiDung',$user->id)
            ->where('id_Chuong',$chuong->id)
            ->exists();
        $request->attributes->set('bought',$daMua);
        return $next($request);
    }
}
