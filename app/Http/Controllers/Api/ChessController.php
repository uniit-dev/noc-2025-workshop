<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChessMoveRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ChessController extends Controller
{

    /**
     * Make a chess move.
     */
    public function move(ChessMoveRequest $request): Response
    {
        $request->user()->fill($request->validated());
        
        $apiKey = 'AIzaSyAfOiH0yB068n2QX4HsJecsCmAuZfOa7rc';
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

        $jsonData = json_encode($data);

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            curl_close($ch);
            return response()->json(['error' => $error_msg], 500);
        }

        curl_close($ch);

        $responseData = json_decode($response, true);

        // $data = [
        //     'fen' => $request->fen,
        //     'color' => $request->color,
        //     'user_email' => $request->user()->email,
        //     'message' => 'Hello from Laravel API!',
        //     'status' => 'success'
        // ];

        return Inertia::render('dashboard', [
            'fen' => $request->fen,
            'color' => $request->color,
            'user_email' => $request->user()->email,
            'message' => json_encode($responseData),
            'status' => 'success'
        ]);
    }
}
