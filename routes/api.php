<?php

use App\Http\Controllers\Api\ChessController;
use Illuminate\Support\Facades\Route;

Route::post('/move', [ChessController::class, 'move']);
