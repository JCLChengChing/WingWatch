function updateSidebar(occurrences) {
  // Clear the current record and location list
  $("#records").empty();
  $("#location-list").empty();

  // Update the records
  if (occurrences.length > 0) {
    $("#records").html('<p>No record</p>');
  }

  // Update the last 5 seen times (display time, but clicking will navigate to the corresponding coordinates)
  const locationsHtml = occurrences.slice(0, 5).map((occurrence) => {
    const lat = occurrence.decimalLatitude.toFixed(4);
    const lon = occurrence.decimalLongitude.toFixed(4);
    const eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleString() : 'Unknown Date';  // Display using local time
    
    return `
      <li onclick="zoomToLocation(${lat}, ${lon})">
        ${eventDate} <!-- Display the time instead of coordinates -->
      </li>`;
  }).join('');

  $("#location-list").html(locationsHtml);
}

// Function to handle the click event on the location list items
function zoomToLocation(lat, lon) {
  // Assuming your map instance is stored in a variable called `map`
  map.setCenter({lat: parseFloat(lat), lng: parseFloat(lon)});
  map.setZoom(20); // Zoom in closer to the location
}

document.addEventListener('DOMContentLoaded', function() {
  const lastSeenBtn = document.getElementById('last-seen-btn');
  const recordBtn = document.getElementById('record-btn');
  
  const recordsDiv = document.getElementById('records');
  const lastFiveLocationsDiv = document.getElementById('last-five-locations');

  const selectedColor = 'rgb(243, 108, 39)'; // Darker orange color
  const unselectedColor = 'rgb(243, 194, 174)'; // Lighter orange color

  // Initially set the correct display and colors
  lastFiveLocationsDiv.style.display = 'block';
  recordsDiv.style.display = 'none';
  lastSeenBtn.style.backgroundColor = selectedColor;
  recordBtn.style.backgroundColor = unselectedColor;

  lastSeenBtn.addEventListener('click', function() {
    lastFiveLocationsDiv.style.display = 'block';
    recordsDiv.style.display = 'none';
    
    lastSeenBtn.style.backgroundColor = selectedColor;
    recordBtn.style.backgroundColor = unselectedColor;
  });

  recordBtn.addEventListener('click', function() {
    lastFiveLocationsDiv.style.display = 'none';
    recordsDiv.style.display = 'block';
    
    recordBtn.style.backgroundColor = selectedColor;
    lastSeenBtn.style.backgroundColor = unselectedColor;

    // Check if there are any records, if not, display "No record"
    if ($("#records").children().length === 0) {
      $("#records").html('<p>No record</p>');
    }
  });

  // Get the modal
  var modal = document.getElementById("modal-pop-up-upload");

  // Get the button that opens the modal
  var btn = document.getElementById("open-modal-btn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("modal-pop-up-close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
    console.log("Modal should be open now");
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
});

// Make sure this function is defined globally
function openModal() {
  alert("openModal function called");
  var modal = document.getElementById("modal-pop-up-upload");
  modal.style.display = "block";
}
