<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ChessMoveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fen' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
            'game_id' => ['required', 'string', 'max:255'],
            'turn' => ['required', 'integer'],
        ];
    }
}
