<?php

use App\Http\Controllers\Api\ChessController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('move', [ChessController::class, 'move'])->name('chess.move');
});