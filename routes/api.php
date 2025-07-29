<?php

use App\Http\Controllers\API\BbbEventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // User info endpoint
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // BBB Events API
    Route::prefix('bbb/events')->group(function () {
        // Webhook endpoint (no auth required)
        Route::post('/', [BbbEventController::class, 'store']);
        
        // Protected endpoints (require auth)
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/', [BbbEventController::class, 'index']);
            Route::get('/{event}', [BbbEventController::class, 'show']);
        });
    });
});