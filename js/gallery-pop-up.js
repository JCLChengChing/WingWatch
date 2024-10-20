function openModal(imageSrc, captionText, birdName) {
  console.log("Opening modal with:", imageSrc, captionText, birdName);
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
  console.log("Closing modal");
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}