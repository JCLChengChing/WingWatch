$(function(){
    // Map handler object
    const MapHandler = {
      map: null,
      currentMarker: null,

      initMap: function() {
        if (!this.map) {
          this.map = L.map('bird-location-map').setView([0, 0], 2);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);
        }
      },

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

    function initBirdLocationMap() {
      if (MapHandler.map) {
        MapHandler.map.remove();
      }
      MapHandler.initMap();
    }

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
    }

    function hideInfo() {
      $('.list-page .info').hide();
      $('.list-page .list').fadeIn();
      $('.list-page .page').fadeIn();
    }

    $('.list-page .desc .head .back').click(hideInfo);

    fetch('data.txt')
      .then(response => response.text())
      .then(data => {
        const listDiv = $('.list');
        const records = data.trim().split('----------------------\n');
  
        listDiv.empty();
  
        // Add the "add" item at the beginning
        const addItem = $('<div>').addClass('picture-item add');
        addItem.append($('<span>').text('+'));
        addItem.click(openModal); // Open modal when clicking the "+" item
        listDiv.append(addItem);
  
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
  
          lines.forEach(line => {
            if (line.startsWith('Entry ID:')) {
              entryId = line.replace('Entry ID:', '').trim();
            } else if (line.startsWith('Location:')) {
              location = line.replace('Location:', '').trim();
            } else if (line.startsWith('Species:')) {
              species = line.replace('Species:', '').trim();
            } else if (line.startsWith('Time:')) {
              time = line.replace('Time:', '').trim();
            } else if (line.startsWith('Image:')) {
              imagePath = line.replace('Image:', '').trim();
            } else if (line.startsWith('Latitude:')) {
              lat = parseFloat(line.replace('Latitude:', '').trim());
            } else if (line.startsWith('Longitude:')) {
              lon = parseFloat(line.replace('Longitude:', '').trim());
            }
          });
  
          const itemDiv = $('<div>').addClass('picture-item').attr('data-entry-id', entryId);
          if (index >= 0) {
            itemDiv.addClass('ball');
          }
  
          const img = $('<img>').attr('src', 'picture/ball.png');
  
          img.click(function() {
            if ($(this).parent().hasClass('add')) {
              openModal(); // Handle the "add" button click by opening the modal
              return;
            }
            
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

// Function to open the modal
function openModal() {
    $('#modal-pop-up-upload').css('display', 'block');
}

// Function to close the modal
function closeModal() {
    $('#modal-pop-up-upload').css('display', 'none');
}

// Add click event listener for the "+" button (assuming you have one)
$('.add').click(openModal);

// Close the modal when clicking the close button
$('.modal-pop-up-close').click(closeModal);

// Close the modal when clicking outside of it
$(window).click(function(event) {
    if (event.target == $('#modal-pop-up-upload')[0]) {
        closeModal();
    }
});

// Add click event listener for the new button
$('#open-modal-btn').click(openModal);

// Handle closing the modal
$('.modal-pop-up-close').click(function() {
    $('#modal-pop-up-upload').hide();
});

// Add this function to handle file selection inside the modal
$('#modal-pop-up-image-upload').change(function(event) {
    var file = event.target.files[0];
    $('#modal-pop-up-image-name').text(file.name);
});
