let globalMarkers = [];

let currentTimeframe = 'month'; // Default timeframe

function updateTimeframeUI() {
  $('.timeframe-buttons button').removeClass('selected');
  $(`#${currentTimeframe}-btn`).addClass('selected');
}


function setTimeframe(timeframe) {
  currentTimeframe = timeframe;
  updateTimeframeUI();
  if (currentSearchTerm) {
      searchBirds(currentSearchTerm);
  } else {
      fetchOccurrences(map, getCurrentMapCenter(), 5);
  }
}


function getDateRange(timeframe) {
  const now = new Date();
  let startDate;
  switch(timeframe) {
      case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);  // Two weeks ago
          break;
      case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());  // a month ago
          break;
      case 'year':
      default:
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());  // One year ago
  }
  return {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
  };
}


function fetchOccurrences(map, centralLocation, radius) {
  showLoading();
  const dateRange = getDateRange(currentTimeframe);
  const pageSize = 100;
  const maxResults = 5000;
  let startIndex = 0;
  let allOccurrences = [];

  function fetchPage() {
      console.log(`Fetching page starting at index ${startIndex}...`);
      $.ajax({
          url: 'https://biocache-ws.ala.org.au/ws/occurrences/search',
          method: 'GET',
          data: {
              q: `*:*`,
              lat: centralLocation.lat,
              lon: centralLocation.lng,
              radius: radius.toFixed(2),
              qualityProfile: 'ALA',
              fq: [
                  'species_group:"Birds"',
                  `eventDate:[${dateRange.start}T00:00:00Z TO ${dateRange.end}T23:59:59Z]`
              ],
              pageSize: pageSize,
              startIndex: startIndex,
          },
          success: function (response) {
              console.log(`Fetched ${response.occurrences.length} occurrences from index ${startIndex}.`);
              allOccurrences = allOccurrences.concat(response.occurrences);
              if (startIndex + pageSize < Math.min(response.totalRecords, maxResults)) {
                  startIndex += pageSize;
                  fetchPage();
              } else {
                  console.log(`All pages fetched. Total records: ${allOccurrences.length}. Processing occurrences.`);
                  processAllOccurrences(allOccurrences, map, centralLocation);
                  hideLoading();
              }
          },
          error: function (xhr, status, error) {
              console.error("Error fetching data: ", status, error);
              hideLoading();
              alert("An error occurred while fetching data. Please try again.");
          }
      });
  }

  fetchPage();
}




function processAllOccurrences(occurrences, map, centralLocation) {
  console.log("Total occurrences received:", occurrences.length);
  
  function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
  }

  const minDate = new Date('2010-01-01').getTime();

  // Filter and add distances
  let occurrencesWithDetails = occurrences
      .filter(occurrence =>
          occurrence.decimalLatitude &&
          occurrence.decimalLongitude &&
          occurrence.eventDate &&
          occurrence.species &&
          new Date(occurrence.eventDate).getTime() >= minDate
      )
      .map(occurrence => ({
          ...occurrence,
          distance: calculateDistance(
              centralLocation.lat,
              centralLocation.lng,
              occurrence.decimalLatitude,
              occurrence.decimalLongitude
          ),
          timestamp: new Date(occurrence.eventDate).getTime()
      }));

  // Sort by distance (ascending)
  occurrencesWithDetails.sort((a, b) => a.distance - b.distance);

  // Get distinct species in distinct locations
  const distinctSpecies = new Set();
  const selectedOccurrences = [];
  const maxOccurrences = 5; // Limit to 5 occurrences
  const minDistanceBetweenMarkers = 0.1; // Minimum 0.1 km between markers

  for (let occurrence of occurrencesWithDetails) {
      if (selectedOccurrences.length >= maxOccurrences) break;

      // Check if this species is already selected
      if (!distinctSpecies.has(occurrence.species)) {
          // Check if this location is far enough from all previously selected locations
          const isFarEnough = selectedOccurrences.every(selected =>
              calculateDistance(
                  selected.decimalLatitude,
                  selected.decimalLongitude,
                  occurrence.decimalLatitude,
                  occurrence.decimalLongitude
              ) >= minDistanceBetweenMarkers
          );

          if (isFarEnough) {
              distinctSpecies.add(occurrence.species);
              selectedOccurrences.push(occurrence);
          }
      }
  }

  console.log("Distinct species to be displayed:", selectedOccurrences.length);
  console.log("Occurrences:", selectedOccurrences);

  // Process and display the occurrences
  processOccurrences({ occurrences: selectedOccurrences }, map);

  // Update the sidebar
  updateSidebar(selectedOccurrences);
}





function processOccurrences(data, map) {
  console.log("Processing occurrences:", data.occurrences.length);

  let currentInfoWindow = null;

  // Clear existing markers
  globalMarkers.forEach(marker => marker.setMap(null));
  globalMarkers = [];

  // Array of bird image URLs
  const birdImages = [
    'picture/image1.png',
    'picture/image2.png',
    'picture/image3.png',
    'picture/image4.png',
    'picture/image5.png'
  ];

  $.each(data.occurrences, function (index, occurrence) {
    var scientificName = occurrence.scientificName;
    var species = occurrence.species;
    var commonName = occurrence.vernacularName || species;
    var location = (occurrence.stateProvince || '') + ", " + (occurrence.country || '');
    var eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleDateString() : 'Unknown Date';
    var lat = occurrence.decimalLatitude;
    var lon = occurrence.decimalLongitude;

    if (species && lat && lon) {
      console.log(`Creating marker for ${commonName || species} at ${lat}, ${lon}`);
      
      var birdImageUrl = birdImages[index % birdImages.length];

      var marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lon) },
        map: map,
        title: scientificName || species,
        icon: {
          url: birdImageUrl,
          scaledSize: new google.maps.Size(54, 64)
        }
      });

      globalMarkers.push(marker);

      var infoWindowContent = `
        <div class="map-tips">
            <div class="tips-title">
                <h2>${commonName || species}</h2>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" class="tips-msg">
                    <span class="google-maps-link">Google Maps</span>
                </a>
            </div>
            <div class="tips-content">
                <h3>${location}</h3>
                <p>Species: ${species}</p>
                <p>Scientific Name: ${scientificName || 'N/A'}</p>
                <p>Observed on: ${eventDate}</p>
            </div>
            <div class="tips-footer">
                <button class="more-btn">More</button>
                <div class="tips-image">
                    <img src="picture/icon-msg.png" alt="Bird Location" width="32" height="32">
                </div>
            </div>            
        </div>
      `;

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', function () {
        if (currentInfoWindow === infoWindow && infoWindow.getMap()) {
          infoWindow.close();
          $('.right-info').hide();
          currentInfoWindow = null;
        } else {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          infoWindow.open(map, marker);
          currentInfoWindow = infoWindow;
          $('.right-info').show();
        }
      });
    }
  });

  console.log("Total markers created:", globalMarkers.length);

  // Clear previous records
  $("#records").empty();

  // Add new records
  data.occurrences.forEach(occurrence => {
    var commonName = occurrence.vernacularName || occurrence.species;
    var scientificName = occurrence.scientificName;
    var location = (occurrence.stateProvince || '') + ", " + (occurrence.country || '');
    var eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleDateString() : 'Unknown Date';

    $("#records").append(
      $('<section class="record map-item">').append(
        $('<h2>').text(commonName + (scientificName ? ` (${scientificName})` : '')),
        $('<h3>').text(location),
        $('<p>').text("Species: " + occurrence.species),
        $('<p>').text("Observed on: " + eventDate)
      )
    );
  });
}






// Initialize and add the map
let map;

async function initMap() {
    const defaultPosition = {
        lat: -27.496237529626793,
        lng: 153.0128469683142
    }; // UQ
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultPosition,
    });

    // Use a fixed radius of 5 km
    const initialRadius = 5;

    // Set up drag event handler
    handleMapDrag(map);

    // Add event listeners to the timeframe buttons
    $('#week-btn').click(() => setTimeframe('week'));
    $('#month-btn').click(() => setTimeframe('month'));
    $('#year-btn').click(() => setTimeframe('year'));

    // Set initial UI state
    updateTimeframeUI();

    currentSearchTerm = ''; // Clear the search term
    fetchOccurrences(map, defaultPosition, initialRadius);
}

function getCurrentMapCenter() {
  if (!map) {
      console.error('Map is not initialized');
      return { lat: -27.496237529626793, lng: 153.0128469683142 }; // Default to UQ coordinates
  }
  const center = map.getCenter();
  return { lat: center.lat(), lng: center.lng() };
}



function updateTimeframeUI() {
    $('.timeframe-buttons button').removeClass('selected');
    $(`#${currentTimeframe}-btn`).addClass('selected');
}

// Call initMap when the document is ready
$(document).ready(function() {
    initMap();
});




// function handleMapDrag(map) {
//   google.maps.event.addListener(map, 'dragend', function() {
//       showLoading(); // Show loading overlay immediately when map is dragged

//       var center = map.getCenter();
//       var centralLocation = {
//           lat: center.lat(),
//           lng: center.lng()
//       };
      
//       var radius = 5; // 5 km radius

//       fetchOccurrences(map, centralLocation, radius);
//   });
// }





function handleMapDrag(map) {
  google.maps.event.addListener(map, 'dragend', function() {
      var bounds = map.getBounds();
      var center = bounds.getCenter();
      var centralLocation = {
          lat: center.lat(),
          lng: center.lng()
      };
      // Estimate the radius based on the map's zoom level
      var zoom = map.getZoom();
      var radius = 40000 / Math.pow(2, zoom); // Rough estimate in km

      if (currentSearchTerm) {
          searchBirds(currentSearchTerm);
      } else {
          fetchOccurrences(map, centralLocation, radius);
      }
  });
}



function showLoading() {
  $('#loading').show();
}

function hideLoading() {
  $('#loading').hide();
}

function getYear(year) {
  if(year) {
      return year.match(/[\d]{4}/);
  }
}

function iterateRecords(data) {
  console.log(data);
  $("#records").empty(); // Clear previous records
  $.each(data.result.records, function(recordKey, recordValue) {
      var recordTitle = recordValue["dc:title"];
      var recordYear = getYear(recordValue["dcterms:temporal"]);
      var recordImage = recordValue["150_pixel_jpg"];
      var recordDescription = recordValue["dc:description"];
      if(recordTitle && recordYear && recordImage && recordDescription) {
          $("#records").append(
              $('<section class="record">').append(
                  $('<h2>').text(recordTitle),
                  $('<h3>').text(recordYear),
                  $('<img>').attr("src", recordImage),
                  $('<p>').text(recordDescription)
              )
          );
      }
  });
  hideLoading(); // Hide loading when done
}

$(document).ready(function() {
  showLoading(); // Show loading before AJAX call
  var data = {
      resource_id: "9eaeeceb-e8e3-49a1-928a-4df76b059c2d",
      limit: 50
  }

  $('.search-bar').on('submit', function(e) {
    e.preventDefault();
    const searchTerm = $('#search-input').val().trim();
    if (searchTerm) {
        searchBirds(searchTerm);
    }
  });

  $.ajax({
      url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
      data: data,
      dataType: "jsonp",
      cache: true,
      success: function(data) {
          iterateRecords(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error("AJAX error: " + textStatus + ' : ' + errorThrown);
          hideLoading(); // Hide loading on error
          alert("An error occurred while fetching data. Please try again.");
      }
  });
});


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

let currentSearchTerm = '';


function searchBirds(searchTerm) {
  currentSearchTerm = searchTerm;
  showLoading();
  const centralLocation = getCurrentMapCenter();
  const zoom = map.getZoom();
  const radius = 40000 / Math.pow(2, zoom); // Use the same radius calculation as in handleMapDrag

  const dateRange = getDateRange(currentTimeframe);
  const lowerSearchTerm = searchTerm.toLowerCase();

  $.ajax({
      url: 'https://biocache-ws.ala.org.au/ws/occurrences/search',
      method: 'GET',
      data: {
          q: `*${searchTerm}*`,
          lat: centralLocation.lat,
          lon: centralLocation.lng,
          radius: radius.toFixed(2),
          qualityProfile: 'ALA',
          fq: [
              'species_group:Birds',
              `eventDate:[${dateRange.start}T00:00:00Z TO ${dateRange.end}T23:59:59Z]`
          ],
          pageSize: 1000
      },
      traditional: true,
      success: function(response) {
          const filteredOccurrences = response.occurrences.filter(occurrence => {
              const commonName = (occurrence.vernacularName || '').toLowerCase();
              const scientificName = (occurrence.scientificName || '').toLowerCase();
              const species = (occurrence.species || '').toLowerCase();
              return commonName.includes(lowerSearchTerm) ||
                     scientificName.includes(lowerSearchTerm) ||
                     species.includes(lowerSearchTerm);
          });
          response.occurrences = filteredOccurrences;
          processSearchResults(response, map);
          hideLoading();
      },
      error: function(xhr, status, error) {
          console.error("Error fetching data: ", status, error);
          console.error("Response text:", xhr.responseText);
          console.error("Request URL:", this.url);
          hideLoading();
          alert("An error occurred while searching. Please try again.");
      }
  });
}




function processSearchResults(data, map) {
  if (data.occurrences && data.occurrences.length > 0) {
      const centralLocation = getCurrentMapCenter();
      
      function calculateDistance(lat1, lon1, lat2, lon2) {
          const R = 6371; // Radius of the Earth in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c; // Distance in km
      }

      const minDate = new Date('2010-01-01').getTime();

      // Filter and add distances
      let occurrencesWithDetails = data.occurrences
          .filter(occurrence =>
              occurrence.decimalLatitude &&
              occurrence.decimalLongitude &&
              occurrence.eventDate &&
              occurrence.species &&
              new Date(occurrence.eventDate).getTime() >= minDate
          )
          .map(occurrence => ({
              ...occurrence,
              distance: calculateDistance(
                  centralLocation.lat,
                  centralLocation.lng,
                  occurrence.decimalLatitude,
                  occurrence.decimalLongitude
              ),
              timestamp: new Date(occurrence.eventDate).getTime()
          }));

      // Sort by distance (ascending)
      occurrencesWithDetails.sort((a, b) => a.distance - b.distance);

      // Get distinct locations
      const selectedOccurrences = [];
      const maxOccurrences = 5; // Limit to 5 occurrences
      const minDistanceBetweenMarkers = 0.2; // Reduced to 0.1 km between markers

      for (let occurrence of occurrencesWithDetails) {
          if (selectedOccurrences.length >= maxOccurrences) break;

          // Check if this location is far enough from all previously selected locations
          const isFarEnough = selectedOccurrences.every(selected =>
              calculateDistance(
                  selected.decimalLatitude,
                  selected.decimalLongitude,
                  occurrence.decimalLatitude,
                  occurrence.decimalLongitude
              ) >= minDistanceBetweenMarkers
          );

          if (isFarEnough) {
              selectedOccurrences.push(occurrence);
          }
      }

      // If we still don't have 5 occurrences, add the closest remaining ones
      if (selectedOccurrences.length < maxOccurrences) {
          for (let occurrence of occurrencesWithDetails) {
              if (selectedOccurrences.length >= maxOccurrences) break;
              if (!selectedOccurrences.includes(occurrence)) {
                  selectedOccurrences.push(occurrence);
              }
          }
      }

      console.log("Distinct occurrences to be displayed:", selectedOccurrences.length);
      console.log("Occurrences:", selectedOccurrences);

      // Process and display the occurrences
      processOccurrences1({ occurrences: selectedOccurrences }, map);

      // Fit the map to show all markers
      const bounds = new google.maps.LatLngBounds();
      globalMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);

      // Update the sidebar
      updateSidebar(selectedOccurrences);
  } else {
      alert("No birds found matching your search.");
  }
}




function updateSidebar(occurrences) {
  $("#records").empty();
  
  const recordsHtml = occurrences.map(occurrence => {
      const commonName = occurrence.vernacularName || occurrence.species || 'Unknown';
      const scientificName = occurrence.scientificName || '';
      const location = [(occurrence.stateProvince || ''), (occurrence.country || '')].filter(Boolean).join(", ");
      const eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleDateString() : 'Unknown Date';
      
      return `
          <section class="record map-item">
              <h2>${commonName}${scientificName ? ` (${scientificName})` : ''}</h2>
              <h3>${location}</h3>
              <p>Species: ${occurrence.species || 'Unknown'}</p>
              <p>Observed on: ${eventDate}</p>
          </section>
      `;
  }).join('');
  
  $("#records").html(recordsHtml);
}

// function clearSearch() {
//   currentSearchTerm = '';
//   $('#search-input').val(''); // Clear the search input field
//   updateTimeframeUI(); // Reset the timeframe UI

//   $('#clear-search-btn').on('click', function(e) {
//     e.preventDefault();
//     clearSearch();
//   }); 
//   const center = getCurrentMapCenter();
//   const zoom = map.getZoom();
//   const radius = 40000 / Math.pow(2, zoom); // Use the same radius calculation as in handleMapDrag
//   fetchOccurrences(map, center, radius);
// }




function processOccurrences1(data, map) {
  console.log("Processing occurrences:", data.occurrences.length);

  let currentInfoWindow = null;

  // Clear existing markers
  globalMarkers.forEach(marker => marker.setMap(null));
  globalMarkers = [];

  // Array of bird image URLs
  const birdImages = [
    'picture/image3.png',
  ];

  $.each(data.occurrences, function (index, occurrence) {
    var scientificName = occurrence.scientificName;
    var species = occurrence.species;
    var commonName = occurrence.vernacularName || species;
    var location = (occurrence.stateProvince || '') + ", " + (occurrence.country || '');
    var eventDate = occurrence.eventDate ? new Date(occurrence.eventDate).toLocaleDateString() : 'Unknown Date';
    var lat = occurrence.decimalLatitude;
    var lon = occurrence.decimalLongitude;

    if (species && lat && lon) {
      console.log(`Creating marker for ${commonName || species} at ${lat}, ${lon}`);
      
      var birdImageUrl = birdImages[index % birdImages.length];

      var marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lon) },
        map: map,
        title: scientificName || species,
        icon: {
          url: birdImageUrl,
          scaledSize: new google.maps.Size(54, 64)
        }
      });

      globalMarkers.push(marker);

      var infoWindowContent = `
        <div class="map-tips">
            <div class="tips-title">
                <h2>${commonName || species}</h2>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" class="tips-msg">
                    <span class="google-maps-link">Google Maps</span>
                </a>
            </div>
            <div class="tips-content">
                <h3>${location}</h3>
                <p>Species: ${species}</p>
                <p>Scientific Name: ${scientificName || 'N/A'}</p>
                <p>Observed on: ${eventDate}</p>
            </div>
            <div class="tips-footer">
                <button class="more-btn">More</button>
                <div class="tips-image">
                    <img src="picture/icon-msg.png" alt="Bird Location" width="32" height="32">
                </div>
            </div>            
        </div>
      `;

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', function () {
        if (currentInfoWindow === infoWindow && infoWindow.getMap()) {
          infoWindow.close();
          $('.right-info').hide();
          currentInfoWindow = null;
        } else {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          infoWindow.open(map, marker);
          currentInfoWindow = infoWindow;
          $('.right-info').show();
        }
      });
    }
  })};