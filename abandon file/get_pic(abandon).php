<?php
function getFirstImage() {
    $dir = 'user_bird/';
    $images = glob($dir . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

    if (count($images) > 0) {
        echo $images[0]; 
    } else {
        echo '/picture/ball.png';  
    }
}
getFirstImage();
?>
