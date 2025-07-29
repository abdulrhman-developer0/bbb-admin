<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

use function Psy\sh;

class BBBService
{
    /**
     * Base URL for the BBB API.
     */
    protected $baseUrl;

    /**
     * Shared Secret for the BBB API.
     */
    protected $sharedSecret;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $serverUrl = config('services.bbb.server_url');
        $this->baseUrl = $serverUrl
            ? trim($serverUrl, '/') . '/api'
            : '';

        $this->sharedSecret = config('services.bbb.shared_secret');
    }




    public function generateJoinLink(string $meetingID, string $fullName, string $password): string
    {
        $params = [
            'fullName' => $fullName,
            'meetingID' => $meetingID,
            'password' => $password, // Use moderatorPW to start the meeting
            'redirect' => 'true',
        ];

        $checksum = $this->generateChecksum('join', $params);
        $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
        $url = rtrim($this->baseUrl, '/') . '/join?' . $query . '&checksum=' . $checksum;

        return $url;
    }

    /**
     * This function is used to call the BBB API.
     *
     * @param string $endpoint The endpoint to call.
     * @param array $prams The parameters to pass to the endpoint.
     * @return array The response from the BBB API.
     */
    public function callEndpoint($endpoint, $prams = [])
    {
        // clean endpoint to remove any slashes
        $endpoint = trim($endpoint, '/');

        // resolve the full url
        $url = rtrim($this->baseUrl, '/') . '/' . $endpoint;

        // validate the url
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException('Invalid URL');
        }

        // sort prams
        // ksort($prams);

        // add checksum for signed request
        $prams['checksum'] = $this->generateChecksum($endpoint, $prams);

        $url .= '?' . http_build_query($prams, '', '&', PHP_QUERY_RFC3986);


        // make the request (BBB API returns XML, not JSON)
        $response = Http::get($url);

        // check if the response is failed and throw with details
        if ($response->failed()) {
            $status = $response->status();
            throw new \Exception("Error in {$url} status[{$status}]: " . $response->body());
        }

        // Parse XML response to array
        return $this->parseXmlResponse($response->body());
    }

    /**
     * Parse XML response from BBB API to array.
     *
     * @param string $xmlString The XML response string.
     * @return array The parsed response as an array.
     */
    protected function parseXmlResponse(string $xmlString): array
    {
        // Suppress libxml errors and use internal error handling
        libxml_use_internal_errors(true);

        // Parse XML string
        $xml = simplexml_load_string($xmlString);

        if ($xml === false) {
            $errors = libxml_get_errors();
            $errorMessage = 'Failed to parse XML response';
            if (!empty($errors)) {
                $errorMessage .= ': ' . $errors[0]->message;
            }
            throw new \Exception($errorMessage);
        }

        // Convert SimpleXML object to array
        return json_decode(json_encode($xml), true);
    }

    /**
     * Generate BBB API checksum.
     *
     * @param string $action The BBB API action name.
     * @param array $params The parameters for the request.
     * @return string The generated checksum.
     */
    protected function generateChecksum(string $action, array $params = []): string
    {
        $queryString = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
        $stringToHash = $action . $queryString . $this->sharedSecret;
        return sha1($stringToHash);
    }

    public function createMeeting(
        ?string $meetingID = null,
        ?string $name = null,
        ?string $attendeePW = null,
        ?string $moderatorPW = null,
        ?string $welcome = null,
        ?int $duration = null,
        ?string $logoutURL = null,
        ?bool $record = null,
        ?bool $autoStartRecording = null,
        ?bool $allowStartStopRecording = null,
        ?bool $muteOnStart = null,
        ?bool $webcamsOnlyForModerator = null,
        ?string $dialNumber = null,
        ?string $voiceBridge = null,
        ?string $maxParticipants = null,
        ?string $meta_category = null
    ): array {
        $params = [
            'meetingID' => $meetingID ?? uniqid('meeting-'),
            'name' => $name ?? 'Default Meeting',
            'attendeePW' => $attendeePW ?? uniqid('ap_'),
            'moderatorPW' => $moderatorPW ?? uniqid('mp_'),
            'welcome' => $welcome ?? 'Welcome to the meeting!',
            // 'duration' => $duration ?? 30,
            // 'logoutURL' => $logoutURL ?? '',
            'record' => ($record ?? false) ? 'true' : 'false',
            // 'autoStartRecording' => ($autoStartRecording ?? false) ? 'true' : 'false',
            // 'allowStartStopRecording' => ($allowStartStopRecording ?? true) ? 'true' : 'false',
            // 'muteOnStart' => ($muteOnStart ?? false) ? 'true' : 'false',
            // 'webcamsOnlyForModerator' => ($webcamsOnlyForModerator ?? false) ? 'true' : 'false',
            // 'dialNumber' => $dialNumber ?? '',
            // 'voiceBridge' => $voiceBridge ?? strval(rand(70000, 79999)),
            // 'maxParticipants' => $maxParticipants ?? '50',
            // 'meta_category' => $meta_category ?? 'Demo',
        ];

        return $this->callEndpoint('create', $params);
    }

    /**
     * Get meeting information from BBB API.
     *
     * @param string $meetingID The ID of the meeting.
     * @param string $moderatorPW The moderator password of the meeting.
     * @return array
     */
    public function getMeetingInfo(string $meetingID, string $moderatorPW): array
    {
        $params = [
            'meetingID' => $meetingID,
            'password' => $moderatorPW,
        ];

        return $this->callEndpoint('getMeetingInfo', $params);
    }
}