<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BBBHookService
{
    /**
     * Constructor
     * 
     * @param BBBService $bbbService
     */
    public function __construct(
        protected BBBService $bbbService
    ) {}

    /**
     * Create a hook in BBB server.
     *
     * @param string $callbackUrl The callback URL for the hook.
     * @param string $meetingId The meeting ID for the hook.
     * @param string $eventType The event type for the hook.
     * @return array The response from the BBB API.
     * @throws \InvalidArgumentException If the URL is invalid.
     * @throws \Exception If the request fails.
     */
    public function createHook(
        string $callbackUrl,
        ?string $meetingId,
        ?string $eventType
    ) {
        $params = [
            'callbackURL' => $callbackUrl,
            'meetingID' => $meetingId,
            'eventID' => $eventType,
            'getRaw' => 'false',
        ];

        return $this->bbbService->callEndpoint('hooks/create', $params);
    }

    /**
     * Remove a hook from BBB server.
     *
     * @param string $hookId The ID of the hook to remove.
     * @return array The response from the BBB API.
     * @throws \InvalidArgumentException If the URL is invalid.
     * @throws \Exception If the request fails.
     */
    public function removeHook(string $hookId)
    {
        $params = [
            'hookID' => $hookId,
            'getRaw' => 'false',
        ];

        return $this->bbbService->callEndpoint('hooks/destroy', $params);
    }

    /**
     * Get hooks list
     * 
     * @param ?string $meetingId
     */
    public function getHooks(?string $meetingId = null): array
    {
        $params = [
            'getRaw' => 'false',
        ];

        if ($meetingId) {
            $params['meetingID'] = $meetingId;
        }

        return $this->bbbService->callEndpoint('hooks/list', $params);
    }
}