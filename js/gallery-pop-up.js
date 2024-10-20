// For the gallery page's popup click event
function openModal(imageSrc, captionText, birdName) {
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-img");
  var caption = document.getElementById("modal-caption");
  var birdNameElement = document.getElementById("bird-name");

  modal.style.display = "flex";
  modalImg.src = imageSrc;
  caption.innerHTML = captionText;
  birdNameElement.innerHTML = birdName; 
}

function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Function to close modal if clicked outside modal content
function closeModalOutside(event) {
  var modal = document.getElementById("modal");

  if (event.target === modal) {
      modal.style.display = "none";
  }
}