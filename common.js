

// Search
function soSubmit(form) {
  alert(form.keys.value);
  return false;
}

// Handle search-input focus and blur events
document.getElementById('search-input').addEventListener('focus', function() {
  this.setAttribute('placeholder', '');
});

document.getElementById('search-input').addEventListener('blur', function() {
  if (this.value === '') {
    this.setAttribute('placeholder', 'Search');
  }
});

// Collect
function onCollect() {
  location.href = 'collect.html';
}