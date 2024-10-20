/**
 * Modal Pop-up Module
 * This module handles the functionality for the modal pop-up used for uploading bird sightings.
 *
 * Reference:
 * MDN Web Docs. (n.d.). Event: stopPropagation() method. https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get the modal element
  var modal = document.getElementById("modal-pop-up-upload");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("modal-pop-up-close")[0];
  
  /**
   * Opens the modal and focuses on the first input field
   */
  function openModal() {
    modal.style.display = "block";
    // Focus the first input field in the modal
    document.getElementById("modal-pop-up-species").focus();
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
  
  // Make openModal function globally accessible
  window.openModal = openModal;
  
  /**
   * Opens the map modal (placeholder function)
   * TODO: Implement actual map modal functionality
   */
  window.openMapModal = function() {
      // Implement map modal functionality here
      console.log("Opening map modal");
  }
  
  // Prevent event propagation in the modal
  modal.addEventListener('click', function(event) {
    event.stopPropagation();
  });
});

/**
 * Event listener for image upload
 * Updates the displayed file name when an image is selected
 */
document.getElementById('modal-pop-up-image-upload').addEventListener('change', function(event) {
  var file = event.target.files[0];
  document.getElementById('modal-pop-up-image-name').innerHTML = file.name;
});
