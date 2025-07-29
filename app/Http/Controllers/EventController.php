<?php

namespace App\Http\Controllers;

use App\Models\BbbEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the events.
     */
    public function index(Request $request)
    {
        $events = BbbEvent::latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($event) => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'created_at' => $event->created_at->format('Y-m-d H:i:s'),
                'payload' => $event->payload,
            ]);

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show(BbbEvent $event)
    {
        return Inertia::render('Events/Show', [
            'event' => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'created_at' => $event->created_at->format('Y-m-d H:i:s'),
                'payload' => $event->payload,
            ]
        ]);
    }
}
