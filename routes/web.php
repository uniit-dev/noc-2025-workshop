<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'game_id' => Str::uuid(),
        ]);
    })->name('dashboard');
    Route::get('replay', function () {
        return Inertia::render('replay/Replay', ['replays' => User::with('gameHistory')->find(Auth::id())->gameHistory->reduce(function ($carry, $item) {
            $carry[$item->game_id][] = $item;
            return $carry;
        }, [])]);
    })->name('replay');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
