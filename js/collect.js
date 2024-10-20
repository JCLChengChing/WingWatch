$(function(){
    /**
     * Map handler object
     * Manages the Leaflet map for displaying bird locations
     */
    const MapHandler = {
      map: null,
      currentMarker: null,

      /**
       * Initializes the Leaflet map
       */
      initMap: function() {
        if (!this.map) {
          this.map = L.map('bird-location-map').setView([0, 0], 2);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);
        }
      },

      /**
       * Displays a marker on the map at the given coordinates
       * @param {number} lat - Latitude
       * @param {number} lon - Longitude
       */
      showOnMap: function(lat, lon) {
        if (!this.map) {
          this.initMap();
        }

        this.map.setView([lat, lon], 14);
        
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }
        
        this.currentMarker = L.marker([lat, lon]).addTo(this.map);

        // Ensure the map renders correctly
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    };

    /**
     * Initializes the bird location map
     */
    function initBirdLocationMap() {
      if (MapHandler.map) {
        MapHandler.map.remove();
      }
      MapHandler.initMap();
    }

    /**
     * Displays bird information and location on the map
     * @param {string} imagePath - Path to the bird image
     * @param {string} location - Location description
     * @param {string} species - Bird species
     * @param {string} time - Time of sighting
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    function showInfo(imagePath, location, species, time, lat, lon) {
      // Format the time to remove 'T'
      const formattedTime = time.replace('T', ' ');

      $('.list-page .list').hide();
      $('.list-page .page').hide();
      $('.list-page .info').fadeIn();
  
      $('#info-image').attr('src', imagePath);
      $('#bird-info').html(`
        <p>Species: ${species}</p>
        <p>Time: ${formattedTime}</p>
      `);

      // Show the location on the map
      MapHandler.showOnMap(lat, lon);

      // Trigger a resize event on the map
      setTimeout(() => {
        MapHandler.map.invalidateSize();
      }, 100);
    }

    /**
     * Hides the bird information panel
     */
    function hideInfo() {
      $('.list-page .info').hide();
      $('.list-page .list').fadeIn();
      $('.list-page .page').fadeIn();
    }

    // Attach click event to hide info
    $('.list-page .desc .head .back').click(hideInfo);

    // Initialize the map when the page loads
    MapHandler.initMap();

    const listDiv = $('.list');

    // Add the "add" item at the beginning of the list
    const addItem = $('<div>').addClass('picture-item add');
    addItem.append($('<span>').text('+'));
    addItem.click(function() {
      openModal(); // Handle the "add" button click by opening the modal
    });
    listDiv.append(addItem);

    // Fetch and process bird data
    fetch('data.txt')
      .then(response => response.text())
      .then(data => {
        const records = data.trim().split('----------------------\n');

        records.forEach((record, index) => {
          if (record.trim() === '') return; // Skip empty records

          const lines = record.split('\n');
          let entryId = '';
          let location = '';
          let species = '';
          let time = '';
          let imagePath = '';
          let lat = 0;
          let lon = 0;

          // Parse each line of the record
          lines.forEach(line => {
            if (line.startsWith('Entry ID:')) {
              entryId = line.replace('Entry ID:', '').trim();
            } else if (line.startsWith('Location:')) {
              location = line.replace('Location:', '').trim();
              // Parse latitude and longitude from the location string
              const latLngMatch = location.match(/Lat: ([-\d.]+), Lng: ([-\d.]+)/);
              if (latLngMatch) {
                lat = parseFloat(latLngMatch[1]);
                lon = parseFloat(latLngMatch[2]);
              }
            } else if (line.startsWith('Species:')) {
              species = line.replace('Species:', '').trim();
            } else if (line.startsWith('Time:')) {
              time = line.replace('Time:', '').trim();
            } else if (line.startsWith('Image:')) {
              imagePath = line.replace('Image:', '').trim();
            }
          });

          // Create and append the bird item to the list
          const itemDiv = $('<div>').addClass('picture-item').attr('data-entry-id', entryId);
          itemDiv.addClass('ball');

          const img = $('<img>').attr('src', 'picture/ball.png');

          img.click(function() {
            if ($(this).parent().hasClass('ball')) {
              $(this).attr('src', imagePath);
              $(this).parent().removeClass('ball');
            }
            showInfo(imagePath, location, species, time, lat, lon);
          });

          itemDiv.append(img);
          const desc = $('<p>').text(species);
          itemDiv.append(desc);
          listDiv.append(itemDiv);
        });
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
});

/**
 * Opens the modal for uploading new bird sightings
 */
function openModal() {
    $('#modal-pop-up-upload').css('display', 'block');
}

/**
 * Closes the modal for uploading new bird sightings
 */
function closeModal() {
    $('#modal-pop-up-upload').css('display', 'none');
}

// Event listeners for modal interactions
$('.add').click(openModal);
$('.modal-pop-up-close').click(closeModal);

// Close the modal when clicking outside of it
$(window).click(function(event) {
    if (event.target == $('#modal-pop-up-upload')[0]) {
        closeModal();
    }
});

// Additional event listeners for modal interactions
$('#open-modal-btn').click(openModal);
$('.modal-pop-up-close').click(function() {
    $('#modal-pop-up-upload').hide();
});

/**
 * Handles file selection inside the modal
 */
$('#modal-pop-up-image-upload').change(function(event) {
    var file = event.target.files[0];
    $('#modal-pop-up-image-name').text(file.name);
});

/**
 * References:
 * YouTube. (n.d.). [Video]. https://www.youtube.com/watch?v=wVnimcQsuwk
 * MDN Web Docs. (n.d.). Leaflet: An open-source JavaScript library for mobile-friendly interactive maps. https://leafletjs.com/
 * Stack Overflow. (2013). How to change CSS property using JavaScript. https://stackoverflow.com/questions/15241915/how-to-change-css-property-using-javascript
 */
