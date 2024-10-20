<?php
header('Content-Type: application/json');

$data_file = "data.txt";
$entries = [];

if (file_exists($data_file)) {
    $lines = file($data_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $current_entry = null;

    foreach ($lines as $line) {
        if (strpos($line, "Entry ID:") === 0) {
            if ($current_entry !== null) {
                $entries[] = $current_entry;
            }
            $current_entry = ['entryId' => trim(substr($line, 10))];
        } elseif ($current_entry !== null) {
            if (strpos($line, "Location:") === 0) {
                $current_entry['location'] = trim(substr($line, 10));
            } elseif (strpos($line, "Species:") === 0) {
                $current_entry['species'] = trim(substr($line, 9));
            } elseif (strpos($line, "Time:") === 0) {
                $current_entry['time'] = trim(substr($line, 6));
            } elseif (strpos($line, "Image:") === 0) {
                $current_entry['image'] = trim(substr($line, 7));
            }
        }
    }

    if ($current_entry !== null) {
        $entries[] = $current_entry;
    }
}

echo json_encode($entries);