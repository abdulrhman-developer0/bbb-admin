<?php

use App\Http\Controllers\API\BbbEventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/bbb/events', \App\Http\Controllers\API\BbbEventController::class);