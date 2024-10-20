// pop-up-map.js

let map;
let marker;

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    map.on('click', function(e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
    });
}

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

function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}

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
