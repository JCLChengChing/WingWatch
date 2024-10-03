<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    /* user data acces */
    $location = $_POST['location'];
    $species = $_POST['species'];
    $time = $_POST['time'];
    
    $target_dir = "user_bird/";  // save to user_bird file
    $target_file = $target_dir . basename($_FILES["image"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    
    // check if it is pic file
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    } 
    
    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            echo "The file ". basename($_FILES["image"]["name"]). " has been uploaded.";
        } else {
            echo "an error when uploading file.";
        }
    }
    // save to data.txt
    $data = "Location: $location\nSpecies: $species\nTime: $time\nImage: $target_file\n\n";
    file_put_contents("data.txt", $data, FILE_APPEND);
    echo "Data saved";
}
