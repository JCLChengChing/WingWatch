/**
 * Pop-up Map Module
 * This module handles the functionality for the pop-up map used for selecting bird sighting locations.
 */

// Global variables
let map;
let marker;

/**
 * Initializes the Leaflet map
 */
function initMap() {
    // Create a map centered at [0, 0] with zoom level 2
    map = L.map('map').setView([0, 0], 2);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Add click event listener to the map
    map.on('click', function(e) {
        // Remove existing marker if any
        if (marker) {
            map.removeLayer(marker);
        }
        // Add a new marker at the clicked location
        marker = L.marker(e.latlng).addTo(map);
    });
}

/**
 * Opens the map modal and initializes the map if not already done
 */
function openMapModal() {
    console.log("openMapModal function called");
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.style.display = 'block';
        if (!map) {
            console.log("Initializing map");
            initMap();
        }
    } else {
        console.error("mapModal element not found");
    }
}

/**
 * Closes the map modal
 */
function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}

/**
 * Confirms the selected location and updates the latitude and longitude inputs
 */
function confirmLocation() {
    if (marker) {
        let lat = marker.getLatLng().lat.toFixed(6);
        let lng = marker.getLatLng().lng.toFixed(6);
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
        closeMapModal();
    } else {
        alert('Please select a location on the map.');
    }
}

// Export functions to be used in other scripts
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;
window.confirmLocation = confirmLocation;
