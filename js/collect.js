

// to do: Initialize the map and set its view to the initial coordinates


$(function(){
    function showInfo(imagePath, location, species, time, lat, lon) {
      // Format the time to remove 'T'
      const formattedTime = time.replace('T', ' ');

      

      $('.list-page .list').hide();
      $('.list-page .page').hide();
      $('.list-page .info').fadeIn();
  
      $('#info-image').attr('src', imagePath);
      $('#bird-info').html(`
        <p>Location: <a href="#" onclick="showOnMap(${lat}, ${lon})">${location}</a></p>
        <p>Species: ${species}</p>
        <p>Time: ${formattedTime}</p>
      `);
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

// Function to show marker on the map
function showOnMap(lat, lon) {
  // Set the map's view to the clicked coordinates and add a marker
  map.setView([lat, lon], 14); // Zoom to level 14
  L.marker([lat, lon]).addTo(map)
    .bindPopup(`Location: [${lat}, ${lon}]`)
    .openPopup();
}
