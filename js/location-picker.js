let locationPickerMap;
let locationPickerMarker;
let pickedLocation = null;
const defaultLocation = {
    lat: -27.496237529626793,
    lng: 153.0128469683142
};

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("modal-pop-up-upload");
    var locationPickerModal = document.getElementById("location-picker-modal");
    var span = document.getElementsByClassName("modal-pop-up-close")[0];

    // Hide location picker modal initially
    if (locationPickerModal) {
        locationPickerModal.style.display = 'none';
    }

    function openModal() {
        if (modal) {
            modal.style.display = "block";
        }
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == locationPickerModal) {
            locationPickerModal.style.display = 'none';
        }
    }

/*     var specimenForm = document.getElementById("modal-pop-up-specimen-form");
    if (specimenForm) {
        specimenForm.onsubmit = function(event) {
            event.preventDefault();
            console.log("Form submitted");
            modal.style.display = "none";
        }
    } */

    window.openModal = openModal;

    window.openLocationPickerModal = function() {
        console.log("openLocationPickerModal called");
        var locationPickerModal = document.getElementById('location-picker-modal');
        console.log("locationPickerModal element:", locationPickerModal);
        
        if (locationPickerModal) {
            console.log("Modal display style before:", locationPickerModal.style.display);
            locationPickerModal.style.display = 'block';
            console.log("Modal display style after:", locationPickerModal.style.display);
            
            if (!locationPickerMap) {
                console.log("Initializing map");
                initLocationPickerMap();
            } else {
                console.log("Map already initialized, invalidating size");
                locationPickerMap.invalidateSize();
            }
        } else {
            console.error("location-picker-modal not found");
        }
    }

    var confirmButton = document.getElementById('location-picker-confirm-button');
    if (confirmButton) {
        confirmButton.addEventListener('click', confirmPickedLocation);
    }
});

function initLocationPickerMap() {
    console.log("initLocationPickerMap called");
    if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded!");
        return;
    }

    var mapElement = document.getElementById('location-picker-map');
    if (!mapElement) {
        console.error("Map element not found!");
        return;
    }

    locationPickerMap = L.map('location-picker-map').setView([defaultLocation.lat, defaultLocation.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationPickerMap);

    locationPickerMarker = L.marker([defaultLocation.lat, defaultLocation.lng]).addTo(locationPickerMap);
    pickedLocation = defaultLocation;

    locationPickerMap.on('click', function(e) {
        updateLocationPickerMarker(e.latlng);
    });

    console.log("Map initialized");
    
    // Force a reflow to ensure the map renders correctly
    locationPickerMap.invalidateSize();
}

function updateLocationPickerMarker(latLng) {
    if (locationPickerMarker) {
        locationPickerMarker.setLatLng(latLng);
    }
    pickedLocation = latLng;
}

function confirmPickedLocation() {
    if (pickedLocation) {
        var locationInput = document.getElementById('modal-pop-up-location');
        if (locationInput) {
            locationInput.value = `Lat: ${pickedLocation.lat.toFixed(6)}, Lng: ${pickedLocation.lng.toFixed(6)}`;
        }
        var locationPickerModal = document.getElementById('location-picker-modal');
        if (locationPickerModal) {
            locationPickerModal.style.display = 'none';
        }
    } else {
        alert('Please select a location on the map first.');
    }
}
