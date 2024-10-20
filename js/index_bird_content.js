/**
 * Bird Content Module
 * This module handles the functionality for updating the sidebar with bird sightings,
 * managing the display of records and last seen locations, and handling the modal popup.
 */

/**
 * Updates the sidebar with the latest bird sightings
 * @param {Array} occurrences - An array of bird sighting occurrences
 */
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

/**
 * Zooms the map to a specific location
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 */
function zoomToLocation(lat, lon) {
  // Assuming your map instance is stored in a variable called `map`
  map.setCenter({lat: parseFloat(lat), lng: parseFloat(lon)});
  map.setZoom(20); // Zoom in closer to the location
}

// DOM Content Loaded event listener
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const lastSeenBtn = document.getElementById('last-seen-btn');
  const recordBtn = document.getElementById('record-btn');
  const recordsDiv = document.getElementById('records');
  const lastFiveLocationsDiv = document.getElementById('last-five-locations');

  // Define color constants
  const selectedColor = 'rgb(243, 108, 39)'; // Darker orange color
  const unselectedColor = 'rgb(243, 194, 174)'; // Lighter orange color

  // Initially set the correct display and colors
  lastFiveLocationsDiv.style.display = 'block';
  recordsDiv.style.display = 'none';
  lastSeenBtn.style.backgroundColor = selectedColor;
  recordBtn.style.backgroundColor = unselectedColor;

  // Event listener for Last Seen button
  lastSeenBtn.addEventListener('click', function() {
    lastFiveLocationsDiv.style.display = 'block';
    recordsDiv.style.display = 'none';
    
    lastSeenBtn.style.backgroundColor = selectedColor;
    recordBtn.style.backgroundColor = unselectedColor;
  });

  // Event listener for Record button
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

  // Modal handling
  var modal = document.getElementById("modal-pop-up-upload");
  var btn = document.getElementById("open-modal-btn");
  var span = document.getElementsByClassName("modal-pop-up-close")[0];

  // Open modal when button is clicked
  btn.onclick = function() {
    modal.style.display = "block";
    console.log("Modal should be open now");
  }

  // Close modal when (x) is clicked
  span.onclick = function() {
    modal.style.display = "none";
  }

  // Close modal when clicking outside of it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

/**
 * Opens the modal popup
 * This function is defined globally for accessibility from other scripts
 */
function openModal() {
  alert("openModal function called");
  var modal = document.getElementById("modal-pop-up-upload");
  modal.style.display = "block";
}
