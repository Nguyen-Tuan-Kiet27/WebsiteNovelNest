<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class CohereService
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('COHERE_API_KEY');
        $this->baseUrl = 'https://api.cohere.ai';
    }

    public function summarize(string $text): ?string
    {
        $prompt = "Tóm tắt chương truyện sau bằng tiếng Việt một cách ngắn gọn, rõ ràng, không dịch sang tiếng Anh:\n\n" . $text;
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type'  => 'application/json',
        ])->post($this->baseUrl . '/v1/chat', [
            'model' => 'command-r-plus',
            'message' => $prompt,
        ]);

        return $response->successful() ? $response->json('text') : null;
    }
}
