<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckContent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tuCam = [
            // ✅ Tục tĩu, phản cảm
            'địt', 'lồn', 'buồi', 'cặc', 'cứt', 'dâm', 'đụ', 'chó', 'ngu', 'vãi lồn',
            'dm', 'vkl', 'vl', 'lon', 'cc', 'lol', 'chịch', 'nứng', 'bú', 'đéo', 'địt mẹ',
            'súc vật', 'óc chó', 'bố mày', 'mẹ mày', 'thằng ngu', 'đồ khốn',

            // ✅ Biến thể phổ biến (có thể regex hóa sau)
            'dit', 'lon', 'buoi', 'cak', 'cak', 'cc', 'đ.m', 'd.m', 'đm', 'đ.mẹ', 'lồn', 'l**n', 'đ**', 'v*',

            // ✅ Miệt thị / kỳ thị giới tính
            'bê đê', 'pê đê', 'bóng lộ', 'hãm', 'dị tật', 'thiểu năng', 'súc sinh',

            // ✅ Kỳ thị dân tộc / sắc tộc
            'da đen', 'khựa', 'chó tàu', 'đồ mọi', 'dân chợ',

            // ✅ Bạo lực, kích động thù hận
            'giết', 'chém', 'bom', 'lật đổ', 'đảo chính', 'phản động',
            'cộng sản chó', 'đảng ngu', 'bọn nó phải chết', 'đáng bị đâm',

            // ✅ Chính trị nhạy cảm
            'việt tân', 'lật đổ', 'xuyên tạc', 'dân chủ giả tạo', '3 que', 'cờ vàng',

            // ✅ Spam, quảng cáo, liên kết
            'http', 'www', '.com', 'zalo.me', 'fb.com', 'facebook.com', 'bán hàng',
            'inbox', 'like page', 'kiếm tiền online', 'mời gọi đầu tư', 'đa cấp', 'tuyển cộng tác viên'
        ];
        // $noiDung = $request->noiDung;
        // if($noiDung)
        //     foreach ($tuCam as $tu) {
        //         // Tách chuỗi thành mảng ký tự an toàn với Unicode
        //         $chars = mb_str_split($tu);
        //         // Escape từng ký tự
        //         $escapedChars = array_map(fn($char) => preg_quote($char, '/'), $chars);
        //         // Nối lại thành regex cho phép xen kẽ khoảng trắng (hoặc ký tự khác nếu bạn muốn)
        //         $pattern = '/' . implode('\s*', $escapedChars) . '/iu';

        //         if (preg_match($pattern, $noiDung)) {
        //             return response()->json(['message' => 'Nội dung chứa từ ngữ không phù hợp.'], 400);
        //         }
        //     }
        // $gioiThieu = $request->gioiThieu;
        // if($gioiThieu)
        //     foreach ($tuCam as $tu) {
        //         // Tách chuỗi thành mảng ký tự an toàn với Unicode
        //         $chars = mb_str_split($tu);
        //         // Escape từng ký tự
        //         $escapedChars = array_map(fn($char) => preg_quote($char, '/'), $chars);
        //         // Nối lại thành regex cho phép xen kẽ khoảng trắng (hoặc ký tự khác nếu bạn muốn)
        //         $pattern = '/' . implode('\s*', $escapedChars) . '/iu';

        //         if (preg_match($pattern, $gioiThieu)) {
        //             return response()->json(['message' => 'Nội dung chứa từ ngữ không phù hợp.'], 400);
        //         }
        //     }
        // return $next($request);
        $fields = ['noiDung', 'gioiThieu','ten','tieuDe','tomTat'];
        $viPham = [];

        foreach ($fields as $field) {
            $text = $request->$field;
            if (!$text) continue;

            foreach ($tuCam as $tu) {
                $chars = mb_str_split($tu);
                $escapedChars = array_map(fn($char) => preg_quote($char, '/'), $chars);
                // $pattern = '/' . implode('\s*', $escapedChars) . '/iu';
                // $pattern = '/\b' . implode('\s*', $escapedChars) . '\b/iu';
                $pattern = '/' . implode('\s*+', array_map(fn($c) => preg_quote($c, '/') . '+', $escapedChars)) . '\b/iu';

                if (preg_match($pattern, $text)) {
                    $viPham[] = $tu;
                }
            }
        }

        if (!empty($viPham)) {
            return response()->json([
                'message' => 'Nội dung chứa từ ngữ không phù hợp: ' . implode(', ', array_unique($viPham))
            ], 400);
        }

        return $next($request);
    }
}
