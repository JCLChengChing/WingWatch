document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var modal = document.getElementById("uploadModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

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
    document.getElementById("specimenForm").onsubmit = function(event) {
      event.preventDefault();
      // Here you would typically send the form data to your server
      console.log("Form submitted");
      modal.style.display = "none";
    }

    // Make openModal function globally accessible
    window.openModal = openModal;
});
