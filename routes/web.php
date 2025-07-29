<?php

use App\Http\Controllers\BbbHookController;
use App\Http\Controllers\ProfileController;
use App\Services\BBBService;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Hooks Resource
    Route::resource('hooks', BbbHookController::class)->except(['show']);
    
    // Events page
    Route::get('/events', function () {
        return Inertia::render('Events/Index');
    })->name('events.index');

    // Profile routes (kept for reference, but not linked in the UI)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';