function updateSidebar(occurrences) {
  // Clear the current record and location list
  $("#records").empty();
  $("#location-list").empty();

  // Update the records, only displaying the bird's commonName
  const recordsHtml = occurrences.map(occurrence => {
    const commonName = occurrence.vernacularName || occurrence.species || 'Unknown';
    return `<section class="record map-item"><h2>${commonName}</h2></section>`;
  }).join('');

  $("#records").html(recordsHtml);

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

  // 初始化，默认显示最后5个发现地点
  lastFiveLocationsDiv.style.display = 'block';
  recordsDiv.style.display = 'none';

  // 点击 "Last seen" 按钮时，显示最后5个发现地点
  lastSeenBtn.addEventListener('click', function() {
    lastFiveLocationsDiv.style.display = 'block';
    recordsDiv.style.display = 'none';
    
    // 修改按钮样式
    lastSeenBtn.style.backgroundColor = 'rgb(243 194 174)';
    recordBtn.style.backgroundColor = ''; // 恢复默认颜色
  });

  // 点击 "Record" 按钮时，显示鸟类记录
  recordBtn.addEventListener('click', function() {
    lastFiveLocationsDiv.style.display = 'none';
    recordsDiv.style.display = 'block';
    
    // 修改按钮样式
    recordBtn.style.backgroundColor = 'rgb(243 194 174)';
    lastSeenBtn.style.backgroundColor = ''; // 恢复默认颜色
  });
});
  
  
  
  
  
  
  
  
  