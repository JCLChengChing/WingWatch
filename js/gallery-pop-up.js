/**
 * Gallery Pop-up Module
 * This module handles the functionality for opening and closing the image modal in the gallery.
 */

/**
 * Opens the modal with the specified image and details
 * @param {string} imageSrc - The source URL of the image to display
 * @param {string} captionText - The caption text for the image
 * @param {string} birdName - The name of the bird species
 */
function openModal(imageSrc, captionText, birdName) {
  console.log("Opening modal with:", imageSrc, captionText, birdName);
  
  // Get DOM elements
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-img");
  var caption = document.getElementById("modal-caption");
  var birdNameElement = document.getElementById("bird-name");

  // Set modal content and display it
  modal.style.display = "flex";
  modalImg.src = imageSrc;
  caption.innerHTML = captionText;
  birdNameElement.innerHTML = birdName; 
}

/**
 * Closes the modal
 */
function closeModal() {
  console.log("Closing modal");
  
  // Get modal element and hide it
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}
