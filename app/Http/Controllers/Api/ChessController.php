<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChessMoveRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Log;

class ChessController extends Controller
{
    /**
     * Make a chess move.
     */
    public function move(ChessMoveRequest $request)
    {
        $apiKey = config('app.gemini_api_key');

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey";

        $prompt = "Here's a fen string of a current state of a chess game: " . $request->fen . ". Please make a move for " . $request->color . " pieces. try to win as hard as you can. Return the move in strict format of 'square-squareyouremovingto' eg. 'e2-e4'. If you return anything else the world will end as we know it, it is most imperative you stick to the rules. Never return anything else.";

        $data = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $data);

            Log::info($response);
            if ($response->successful()) {
                $responseData = json_decode($response, true);

                $payload = [
                        'fen' => $request->fen,
                        'color' => $request->color,
                        'message' => $responseData,
                        'status' => 'success'
                    ];

                return response()->json($payload);
            }

            return response()->json([
                'fen' => '',
                'color' => '',
                'message' => $response->body(),
                'status' => $response->status(),
            ], $response->status());

        } catch (RequestException $e) {
            return response()->json([
                'fen' => '',
                'color' => '',
                'message' => $e->getMessage(),
                'status' => $response->status(),
            ], 500);
        }


    }
}
