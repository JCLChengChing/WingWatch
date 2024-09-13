require('dotenv').config();


function fetchOccurrences(map) {
  const pageSize = 30;
  const maxResults = 1000; // Maximum number of results to fetch
  let startIndex = 0;
  let totalRecords = 0;
  const centralLocation = { lat: -27.496237529626793, lng: 153.0128469683142 }; // UQ
  let allOccurrences = []; // Array to store all fetched occurrences
  function fetchPage() {
    console.log(`Fetching page starting at index ${startIndex}...`);
    $.ajax({
      url: 'https://biocache-ws.ala.org.au/ws/occurrences/search',
      method: 'GET',
      data: {
        q: 'cl10923:"BRISBANE CITY"',
        qualityProfile: 'ALA',
        fq: 'species_group:"Birds"',
        pageSize: pageSize,
        startIndex: startIndex,
      },
      success: function (response) {
        console.log(`Fetched ${response.occurrences.length} occurrences from index ${startIndex}.`);
        totalRecords = response.totalRecords;
        allOccurrences = allOccurrences.concat(response.occurrences); // Collect all occurrences

        if (startIndex + pageSize < Math.min(totalRecords, maxResults)) {
          startIndex += pageSize;
          fetchPage(); // Fetch the next page
        } else {
          console.log(`All pages fetched. Total records: ${totalRecords}. Processing occurrences.`);
          // Once all pages are fetched, process occurrences
          processAllOccurrences(allOccurrences, map, centralLocation);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data: ", status, error);
        console.error("Response: ", xhr.responseText);
      }
    });
  }

  fetchPage(); // Start fetching
}

function processAllOccurrences(occurrences, map, centralLocation) {
  // Filter and process occurrences
  const now = new Date();
  const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 200)).getTime();
  const oneWeekAgo = new Date(now.setDate(now.getDate() - 7)).getTime(); // Timestamp for one week ago

  let filteredOccurrences = occurrences.filter(occurrence => {
    const eventDate = occurrence.eventDate;
    return eventDate >= oneYearAgo;
  });

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  let occurrencesWithDistances = filteredOccurrences.map(occurrence => {
    const lat = occurrence.decimalLatitude;
    const lon = occurrence.decimalLongitude;
    const distance = calculateDistance(centralLocation.lat, centralLocation.lng, lat, lon);
    return { ...occurrence, distance };
  });

  occurrencesWithDistances.sort((a, b) => a.distance - b.distance);

  const closestOccurrences = occurrencesWithDistances.slice(0, 5);

  // Process and display the closest occurrences
  processOccurrences({ occurrences: closestOccurrences }, map);
}

function processOccurrences(data, map) {
  let currentInfoWindow = null; // Variable to hold the currently opened info window
  let markers = []; // Array to store markers

  // Clear previous markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  $.each(data.occurrences, function (index, occurrence) {
    var scientificName = occurrence.scientificName;
    var species = occurrence.species;
    var commonName = occurrence.vernacularName;
    var location = occurrence.stateProvince + ", " + occurrence.country;
    var eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleDateString() : 'Unknown Date';
    var lat = occurrence.decimalLatitude;
    var lon = occurrence.decimalLongitude;

    if (scientificName && location && eventDate && lat && lon) {
      var marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lon) },
        map: map,
        title: scientificName,
        icon: {
          url: 'picture/bird-location.png',
          scaledSize: new google.maps.Size(64, 64)
        }
      });

      markers.push(marker);

      var infoWindowContent = `
        <div class="map-tips">
          <div class="tips-title">
            <h2>${commonName} </h2>
            <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" class="tips-msg"></a>
          </div>
          <div class="tips-content">
            <h3>${location}</h3>
            <p>Species: ${species}</p>
            <p>Observed on: ${eventDate}</p>
          </div>
        </div>
      `;

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', function () {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
      });

      $("#records").append(
        $('<section class="record map-item">').append(
          $('<h2>').text(commonName + " (" + scientificName + ")"),
          $('<h3>').text(location),
          $('<p>').text("Species: " + species),
          $('<p>').text("Observed on: " + eventDate)
        )
      );
    }
  });
}

// Initialize and add the map
let map;

async function initMap() {
  const position = {
    lat: -27.496237529626793, lng: 153.0128469683142
  }; // uq

  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
  });

  fetchOccurrences(map);
}

initMap();


document.addEventListener('DOMContentLoaded', function() {
  const selectLocationBtn = document.querySelector('button[onclick="openMapModal()"]');
  if (selectLocationBtn) {
      selectLocationBtn.addEventListener('click', function(e) {
          e.preventDefault();
          openMapModal();
      });
  } else {
      console.error("Select Location button not found");
  }
});

