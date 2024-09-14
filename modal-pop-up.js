document.addEventListener('DOMContentLoaded', function() {
  // Get the modal
  var modal = document.getElementById("modal-pop-up-upload");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("modal-pop-up-close")[0];
  
  // Function to open the modal
  function openModal() {
      modal.style.display = "block";
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
  
  // Handle form submission
  document.getElementById("modal-pop-up-specimen-form").onsubmit = function(event) {
      event.preventDefault();
      // Here you would typically send the form data to your server
      console.log("Form submitted");
      modal.style.display = "none";
  }
  
  // Make openModal function globally accessible
  window.openModal = openModal;
  
  // Function to open map modal (you'll need to implement this)
  window.openMapModal = function() {
      // Implement map modal functionality here
      console.log("Opening map modal");
  }
});
