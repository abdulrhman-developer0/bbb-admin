<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BbbEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BbbEventController extends Controller
{
    /**
     * Handle incoming webhook events from BigBlueButton
     */
    public function __invoke(Request $request)
    {
        try {
            // Log the raw request for debugging
            Log::info('BBB Webhook Received:', [
                'headers' => $request->headers->all(),
                'payload' => $request->all(),
            ]);

            // Extract event data from the request
            $eventData = $request->all();
            $eventType = 'unknown';
            
            // Try to determine the event type from the payload
            if (isset($eventData['event'])) {
                if (is_string($eventData['event'])) {
                    // If event is a JSON string, decode it
                    $decodedEvent = json_decode($eventData['event'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $eventData = array_merge($eventData, ['event' => $decodedEvent]);
                    }
                }
                
                // Try to get the event type from the nested structure
                if (is_array($eventData['event']) && isset($eventData['event']['data']['type'])) {
                    $eventType = $eventData['event']['data']['type'];
                } elseif (isset($eventData['event']['envelope']['name'])) {
                    $eventType = $eventData['event']['envelope']['name'];
                } elseif (isset($eventData['event']['header']['name'])) {
                    $eventType = $eventData['event']['header']['name'];
                }
            }
            
            // Store the event
            BbbEvent::create([
                'event' => $eventType,
                'payload' => $eventData,
                'processed' => false,
            ]);

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Error processing BBB webhook: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a list of all events
     */
    public function index()
    {
        $events = BbbEvent::latest()->paginate(20);
        return response()->json($events);
    }

    /**
     * Get a specific event
     */
    public function show(BbbEvent $event)
    {
        return response()->json($event);
    }
}