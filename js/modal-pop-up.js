document.addEventListener('DOMContentLoaded', function() {
  // Get the modal
  var modal = document.getElementById("modal-pop-up-upload");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("modal-pop-up-close")[0];
  
  // Function to open the modal
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
  
  // Function to open map modal (you'll need to implement this)
  window.openMapModal = function() {
      // Implement map modal functionality here
      console.log("Opening map modal");
  }
  
  // Prevent event propagation in the modal
  modal.addEventListener('click', function(event) {
    event.stopPropagation();
  });
});

document.getElementById('modal-pop-up-image-upload').addEventListener('change', function(event) {
  var file = event.target.files[0];
  document.getElementById('modal-pop-up-image-name').innerHTML = file.name;
});
