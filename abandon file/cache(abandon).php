<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Expires: 0');
header('Pragma: no-cache');

// Define cache directory and ensure it exists
$cacheDir = 'cache/';

// Generate a unique cache key based on request parameters
$cacheKey = md5(json_encode($_GET));
$cacheFile = $cacheDir . 'occurrences_' . $cacheKey . '.json';
$cacheTime = 3600; // 1 hour

// Function to get data from API
function fetchDataFromAPI() {
    $api_url = 'https://biocache-ws.ala.org.au/ws/occurrences/search?';
    $queryParams = [
        'q' => '*:*',
        'lat' => -27.496237529626793,
        'lon' => 153.0128469683142,
        'radius' => 5,
        'qualityProfile' => 'ALA',
        'pageSize' => 100,
        'startIndex' => 0
    ];

    $fq = 'species_group:"Birds"&eventDate:[2010-01-01T00:00:00Z TO ' . date('Y-m-d') . 'T23:59:59Z]';

    $url = $api_url . http_build_query($queryParams);
    $data = file_get_contents($url);

    if ($data === false || json_decode($data) === null) {
        throw new Exception('Unable to fetch or parse data from API');
    }

    return $data;
}

// Try to get data from cache
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
    $data = file_get_contents($cacheFile);
    if ($data === false) {
        $data = json_encode(['error' => 'Failed to read cache file']);
    }
} else {
    // If cache doesn't exist or is expired, fetch new data
    try {
        $data = fetchDataFromAPI();
        
        // Use exclusive lock for writing to prevent race conditions
        $fp = fopen($cacheFile, 'w');
        if (flock($fp, LOCK_EX)) {
            fwrite($fp, $data);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
    } catch (Exception $e) {
        $data = json_encode(['error' => $e->getMessage()]);
    }
}
error_log('API Request URL: ' . $url);
error_log('API Response: ' . $data);
// Return data to frontend
echo $data;
