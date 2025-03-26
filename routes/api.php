<?php

use App\Http\Controllers\Api\ChessController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/move', [ChessController::class, 'move']);
    Route::post('/record-move', [ChessController::class, 'record']);
});
