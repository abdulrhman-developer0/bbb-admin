<?php

namespace App\Http\Controllers;

use App\Models\BbbHook;
use App\Models\User;
use App\Services\BBBHookService;
use App\Services\BBBService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BbbHookController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected BBBHookService $bbbHookService
    ) {}

    /**
     * List all hooks for the authenticated user.
     */
    /**
     * Display a listing of the hooks.
     */
    public function index()
    {
        // $this->bbbHookService->getHooks()->pluck('hookID')->each(function ($hookID) {
        //     $this->bbbHookService->removeHook($hookID);
        // });

        dd($this->bbbHookService->getHooks()->toArray());

        $hooks = auth()->user()->hooks()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Hooks/Index', [
            'hooks' => $hooks,
            'status' => session('status'),
        ]);
    }

    /**
     * Show the form for creating a new hook.
     */
    public function create()
    {
        return Inertia::render('Hooks/Create', [
            'eventTypes' => [
                'meeting-created' => 'Meeting Created',
                'meeting-ended' => 'Meeting Ended',
                'user-joined' => 'User Joined',
                'user-left' => 'User Left',
                'presentation-uploaded' => 'Presentation Uploaded',
                'recording-ready' => 'Recording Ready'
            ]
        ]);
    }

    /**
     * Store a newly created hook in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'callback_url' => 'required|url',
            'meeting_id' => 'nullable|string',
            'event_type' => [
                'nullable',
                Rule::in([
                    'meeting-created',
                    'meeting-ended',
                    'user-joined',
                    'user-left',
                    'presentation-uploaded',
                    'recording-ready'
                ])
            ],
            'permanent_hook' => 'sometimes|boolean',
            'raw_data' => 'sometimes|boolean',
        ]);


        // Register the hook with BBB server
        if (! $this->bbbHookService->callbackUrlExists($validated['callback_url'])) {
            $hookData = $this->bbbHookService->createHook(
                callbackUrl: $request->input('callback_url'),
                meetingId: $request->input('meeting_id'),
                eventType: $request->input('event_type')
            );
        } else {
            throw ValidationException::withMessages([
                'callback_url' => 'Callback URL already exists',
            ]);
        }

        // Store the hook in our database
        $hook = $request->user()->hooks()->create([
            'callback_url' => $validated['callback_url'],
            'meeting_id' => $validated['meeting_id'] ?? null,
            'hook_id' => $hookData['hookID'] ?? null,
            'event_type' => $validated['event_type'],
            'metadata' => $hookData,
            'is_active' => true,
            'permanent_hook' => $validated['permanent_hook'] ?? false,
            'raw_data' => $validated['raw_data'] ?? false,
        ]);

        return redirect()->route('hooks.index')
            ->with('status', 'Hook created successfully');
    }

    /**
     * Show details of a specific hook.
     */
    public function show(BbbHook $hook)
    {
        $this->authorize('view', $hook);

        return Inertia::render('Hooks/Show', [
            'hook' => $hook->load('user')
        ]);
    }

    /**
     * Show the form for editing the specified hook.
     */
    public function edit(BbbHook $hook)
    {
        $this->authorize('update', $hook);

        return Inertia::render('Hooks/Edit', [
            'hook' => $hook,
            'eventTypes' => [
                'meeting-created' => 'Meeting Created',
                'meeting-ended' => 'Meeting Ended',
                'user-joined' => 'User Joined',
                'user-left' => 'User Left',
                'presentation-uploaded' => 'Presentation Uploaded',
                'recording-ready' => 'Recording Ready'
            ]
        ]);
    }

    /**
     * Update the specified hook in storage.
     */
    public function update(Request $request, BbbHook $hook)
    {
        $this->authorize('update', $hook);

        $validated = $request->validate([
            'callback_url' => 'required|url',
            'meeting_id' => 'nullable|string',
            'event_type' => [
                'required',
                Rule::in([
                    'meeting-created',
                    'meeting-ended',
                    'user-joined',
                    'user-left',
                    'presentation-uploaded',
                    'recording-ready'
                ])
            ],
            'is_active' => 'sometimes|boolean',
        ]);

        try {
            // If important fields changed, we might need to re-register with BBB
            if (
                $hook->callback_url !== $validated['callback_url'] ||
                $hook->event_type !== $validated['event_type']
            ) {

                // First remove the old hook
                if ($hook->hook_id) {
                    $this->unregisterHookFromBbb($hook);
                }

                // Register new hook
                $response = $this->registerHookWithBbb($request->user(), [
                    'callback_url' => $validated['callback_url'],
                    'meeting_id' => $validated['meeting_id'] ?? null,
                    'event_type' => $validated['event_type']
                ]);

                if (!$response->successful()) {
                    return back()->withErrors([
                        'error' => 'Failed to update hook with BBB server: ' .
                            ($response->json()['message'] ?? 'Unknown error')
                    ]);
                }

                $hookData = $response->json();
                $validated['hook_id'] = $hookData['hookID'] ?? null;
                $validated['metadata'] = $hookData;
            }

            $hook->update($validated);

            return redirect()->route('hooks.index')
                ->with('status', 'Hook updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating hook: ' . $e->getMessage());
            return back()->withErrors([
                'error' => 'Failed to update hook. Please try again.'
            ]);
        }
    }

    /**
     * Remove the specified hook from storage.
     */
    public function destroy(BbbHook $hook)
    {
        $this->authorize('delete', $hook);

        try {
            // Remove from BBB server if hook ID exists
            if ($hook->hook_id && $this->bbbHookService->hookExists($hook->hook_id)) {
                $this->bbbHookService->removeHook($hook->hook_id);
            }

            $hook->delete();

            return redirect()->route('hooks.index')
                ->with('status', 'Hook deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting hook: ' . $e->getMessage());
            return back()->withErrors([
                'error' => 'Failed to delete hook. Please try again.'
            ]);
        }
    }
}