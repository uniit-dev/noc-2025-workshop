<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChessMoveRequest;
use App\Models\History;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChessController extends Controller
{
    /**
     * Make a chess move.
     */
    public function move(ChessMoveRequest $request)
    {
        Log::info($request);
        $apiKey = config('app.gemini_api_key');

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey";

        $prompt = "Here's a fen string of a current state of a chess game: " . $request->fen . ".
                    Please make a move for " . $request->color . " pieces.
                    Try to win as hard as you can.
                    Return the move in strict format of 'square-squareyouremovingto' eg. 'e2-e4'.
                    If you return anything else the world will end as we know it, it is most imperative you stick to the rules. Never return anything else.
                    The valid moves are only [a-h][1-8][a-h][1-8], so a1-a2 etc, Nb8 and such are not valid moves";

        $data = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $data);

            if ($response->successful()) {
                $responseData = json_decode($response, true);

                $game_id = $request->game_id;
                $fen = $request->fen;
                $turn = $request->turn;

                $this->createHistoryLog($game_id, $fen, $turn);

                $payload = [
                        'requestedMove' => $responseData['candidates'][0]['content']['parts'][0]['text'],
                        'status' => 'success'
                    ];

                return response()->json($payload);
            }

            return response()->json([
                'requestedMove' => '',
                'status' => $response->status(),
            ], $response->status());

        } catch (RequestException $e) {
            return response()->json([
                'requestedMove' => '',
                'status' => $response->status(),
            ], 500);
        }


    }

    public function record(ChessMoveRequest $request)
    {
        $game_id = $request->game_id;
        $fen = $request->fen;
        $turn = $request->turn;

        $this->createHistoryLog($game_id, $fen, $turn);

        return response()->json(['message' => 'Record saved'], 200);
    }

    private function createHistoryLog(String $game_id, String $fen, int $turn)
    {
        History::create([
            'game_id' => $game_id,
            'user_id' => Auth::id(),
            'fen' => $fen,
            'turn' => $turn,
        ]);
    }
}
