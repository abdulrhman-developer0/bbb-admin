<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BbbEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BbbEventController extends Controller
{
    public function __invoke(Request $request)
    {
        Log::info($request->all());

        $payload = $request->all();
        $eventType = 'unknown';

        BbbEvent::create([
            'event_type' => $eventType,
            'payload' => $payload,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Event received successfully',
        ]);
    }
}