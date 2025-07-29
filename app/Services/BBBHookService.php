<?php

namespace App\Services;

use Illuminate\Support\Collection;
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
            'hookID' => $hookId
        ];

        $data = $this->bbbService->callEndpoint('hooks/destroy', $params);

        if ($data['returncode'] != 'SUCCESS') {
            return false;
        }

        return $data['removed'];
    }

    /**
     * Check if a callback URL is already registered.
     *
     * @param string $callbackUrl The callback URL to check.
     * @return bool True if the callback URL is registered, false otherwise.
     */
    public function callbackUrlExists(string $callbackUrl): bool
    {
        $hooks = $this->getHooks();
        $urls = $hooks->pluck('callbackURL')->toArray();
        return in_array($callbackUrl, $urls);
    }

    /**
     *  Check if a hook exists in BBB server.
     *
     * @param string $hookId The ID of the hook to check.
     * @return bool True if the hook exists, false otherwise.
     */
    public function hookExists(string $hookId): bool
    {
        $hooks = $this->getHooks();
        $ids = $hooks->pluck('hookID')->toArray();
        return (in_array($hookId, $ids));
    }

    /**
     * Get hooks list
     * 
     * @param ?string $meetingId
     */
    public function getHooks(?string $meetingId = null): Collection
    {
        $params = [
            'meetingID' => $meetingId,
        ];

        $data = $this->bbbService->callEndpoint('hooks/list', $params);

        if ($data['returncode'] != 'SUCCESS') {
            return collect([]);
        }

        return collect($data['hooks']['hook']);
    }
}