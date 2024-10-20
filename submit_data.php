<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "PHP script started";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $location = $_POST['location'];
    $species = $_POST['species'];
    $time = $_POST['time'];

    $target_dir = "user_bird/";
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            die("Failed to create target directory: $target_dir");
        }
    }

    $timestamp = time(); 
    $imageFileType = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
    $target_file = $target_dir . $timestamp . '.' . $imageFileType; 

    $uploadOk = 1;

  
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        $uploadOk = 0;
        die("File is not an image.");
    }

    $id_file = "id_counter.txt";
    if (file_exists($id_file)) {
        $entry_id = (int)file_get_contents($id_file); 
    } else {
        $entry_id = 0; 
    }

    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $data = "Entry ID: $entry_id\n";
            $data .= "Location: $location\n";
            $data .= "Species: $species\n";
            $data .= "Time: $time\n";
            $data .= "Image: $target_file\n";
            $data .= "----------------------\n\n";

            $data_file = "data.txt";
            if (file_put_contents($data_file, $data, FILE_APPEND) === false) {
                die("Failed to write data to $data_file");
            }

            $entry_id++;
            if (file_put_contents($id_file, $entry_id) === false) {
                die("Failed to update entry ID in $id_file");
            }

            header("Location: collect.html");
            exit();
        } else {
            die("An error occurred when uploading the file.");
        }
    }
}
?>
