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
     * This method receives $request->fen and $request->color and sends a request to the Gemini API to generate a move.
     * The response is then returned as a JSON response, from which we extract the move and return it to the user.
     */
    public function move(ChessMoveRequest $request)
    {
        // STEP 1: Get the API key from the .env file using config()

        // STEP 2: Define the URL to the Gemini API and the prompt to send

        // STEP 3: Setup the data to be sent to the API based on https://ai.google.dev/gemini-api/docs/text-generation

        try {
            // STEP 4: Send a POST request to the Gemini API Using Illuminate\Support\Facades\Http https://laravel.com/docs/11.x/http-client#headers


            // STEP 5: Check if the request was successful and return the response
            // if (success) {

                $game_id = $request->game_id;
                $fen = $request->fen;
                $turn = $request->turn;

                $this->createHistoryLog($game_id, $fen, $turn);


            //    return response;
            //}

            return // no success;

        } catch (RequestException $e) {
            // STEP 6: Handle errors
            return // 500;
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

    /** BONUS: Implement this function for logging chess moves.
     *  Use the mass assignment method: https://laravel.com/docs/12.x/eloquent#mass-assignment
     */
    private function createHistoryLog(String $game_id, String $fen, int $turn)
    {
        //NOTE: You can retrieve the user id via the Auth::id() helper method.

    }
}
