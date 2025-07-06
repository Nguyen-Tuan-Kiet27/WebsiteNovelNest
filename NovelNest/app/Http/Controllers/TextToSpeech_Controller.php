<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Chuong;

set_time_limit(300); // Zalo phản hồi nhanh nhưng ghép file mất thời gian

class TextToSpeech_Controller extends Controller
{
    protected $zaloApiKey = 'iTwrMkTt3DF65kMMbhe3DPhG1K9k8z13';
    // protected $zaloApiKey = '5Pvp1ICYU3rCBBDWVMmcA48Q1nhejRQj';

    public function callZaloTTS($text, $speakerId = 3)
    {
        while (true) {
            $response = Http::asForm()->withHeaders([
                'apikey' => $this->zaloApiKey,
            ])->post('https://api.zalo.ai/v1/tts/synthesize', [
                'input' => $text,
                'speaker_id' => $speakerId,
            ]);

            if ($response->failed()) {
                Log::error('Zalo API lỗi: ' . $response->body());
                sleep(10);
                continue;
            }
            break;
        }

        $url = $response->json()['data']['url'] ?? null;
        Log::info('Zalo trả về URL: ' . $url);
        return $url;
    }

    public function splitTextByLimit($text, $limit = 200)
    {
        $parts = [];
        while (mb_strlen($text) > $limit) {
            $chunk = mb_substr($text, 0, $limit);
            $lastSpace = mb_strrpos($chunk, ' ');
            $splitAt = $lastSpace ?: $limit;
            $parts[] = trim(mb_substr($text, 0, $splitAt));
            $text = ltrim(mb_substr($text, $splitAt));
        }
        if (!empty($text)) {
            $parts[] = trim($text);
        }
        return $parts;
    }

    public function get(Request $request, $id, $speakerId)
    {
        Log::info('Bắt đầu chuyển giọng đọc');
        $storagePath = storage_path("app/private/tts/t{$id}_{$speakerId}.mp3");

        if (file_exists($storagePath)) {
            return response()->file($storagePath, [
                'Content-Type' => 'audio/mpeg',
                'Content-Disposition' => 'inline; filename="t'.$id.'_'.$speakerId.'.mp3"',
            ]);
        }

        Log::info('Không thấy file, bắt đầu tạo');
        $chuong = Chuong::findOrFail($id);
        $texts = $this->splitTextByLimit($chuong->tomTat);
        $tmpDir = storage_path('app/tts_tmp');
        if (!is_dir($tmpDir)) mkdir($tmpDir, 0755, true);
        $files = [];

        foreach ($texts as $index => $text) {
            $url = $this->callZaloTTS($text, $speakerId);
            if (!$url) continue;
            sleep(10);
            // Tải file mp3 từ URL
            try {
                $audioData = file_get_contents($url);
            } catch (\Exception $e) {
                Log::error("Không thể tải file mp3 từ $url");
                continue;
            }

            if (!$audioData) {
                Log::error("Lỗi khi tải mp3 từ Zalo");
                continue;
            }

            $filePath = $tmpDir . "/part{$index}.mp3";
            file_put_contents($filePath, $audioData);
            $files[] = $filePath;

        }

        if (count($files) === 0) {
            return response()->json(['error' => 'Không thể tạo audio'], 500);
        }

        // Gộp file
        $listPath = $tmpDir . '/list.txt';
        $listContent = '';
        foreach ($files as $file) {
            $listContent .= "file '" . addslashes($file) . "'\n";
        }
        file_put_contents($listPath, $listContent);

        $mergedPath = $tmpDir . "/merged.mp3";
        $command = "ffmpeg -y -f concat -safe 0 -i \"$listPath\" -acodec libmp3lame \"$mergedPath\"";
        exec($command);

        $finalPath = "tts/t{$id}_{$speakerId}.mp3";
        Storage::put($finalPath, file_get_contents($mergedPath));

        return response()->file(storage_path("app/private/" . $finalPath), [
            'Content-Type' => 'audio/mpeg',
            'Content-Disposition' => 'inline; filename="t'.$id.'_'.$speakerId.'.mp3"',
        ]);
    }
}
