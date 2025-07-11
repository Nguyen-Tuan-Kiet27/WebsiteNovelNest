<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CohereService;

class Summary_Controller extends Controller
{
    public function __construct(protected CohereService $cohere) {}

    public function summarize(Request $request)
    {
        $user = $request->attributes->get("user");
        if(!$user || $user->premium < now() &&  $user->vaiTro == 3){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }

        $request->validate([
            'text' => 'required|string|max:100000', // giới hạn max đầu vào
        ]);

        $rawHtml = $request->input('text');
        $text = strip_tags($rawHtml);

        // Tách văn bản thành các đoạn <= 3000 ký tự (không cắt giữa từ)
        // $chunks = $this->splitText($text, 3000);
        $summaries = [];
        $b = false;
        // foreach ($chunks as $chunk) {
        //     $summary = $this->cohere->summarize($chunk);
        //     if ($summary) {
        //         $summaries[] = $summary;
        //     }else{
        //         $b = true;
        //     }
        // }
        $summary = $this->cohere->summarize($text);
        if ($summary) {
            $summaries[] = $summary;
        }else{
            $b = true;
        }
        if ($b) {
            return response()->json([
                'summary' => implode("\n\n", $summaries),
            ],500);
        }
        return response()->json([
            'summary' => implode("\n\n", $summaries),
        ],200);
    }

    protected function splitText(string $text, int $maxLength): array
    {
        $chunks = [];
        while (strlen($text) > $maxLength) {
            // $cutAt = mb_strrpos(mb_substr($text, 0, $maxLength), ". ");
            // $cutAt = $cutAt ?: $maxLength;

            $subText = mb_substr($text, 0, $maxLength);

            // Tìm vị trí các dấu ngắt: chấm, phẩy, khoảng trắng
            $cutAtDot   = mb_strrpos($subText, '.');
            $cutAtComma = mb_strrpos($subText, ',');
            $cutAtSpace = mb_strrpos($subText, ' ');

            // Ưu tiên dấu chấm, sau đó phẩy, rồi đến khoảng trắng
            if ($cutAtDot !== false) {
                $cutAt = $cutAtDot;
            } elseif ($cutAtComma !== false) {
                $cutAt = $cutAtComma;
            } elseif ($cutAtSpace !== false) {
                $cutAt = $cutAtSpace;
            } else {
                // Không có dấu nào thì cắt thẳng tại maxLength
                $cutAt = $maxLength;
            }

            $chunks[] = trim(mb_substr($text, 0, $cutAt + 1));
            $text = mb_substr($text, $cutAt + 1);
        }

        if (!empty(trim($text))) {
            $chunks[] = trim($text);
        }

        return $chunks;
    }
}
