/**
 * Common JavaScript functions for the bird watching application
 * This file contains utility functions and event handlers used across multiple pages
 */

/**
 * Handles the search form submission
 * @param {HTMLFormElement} form - The search form element
 * @returns {boolean} Always returns false to prevent form submission
 */
function soSubmit(form) {
  alert(form.keys.value);
  return false;
}

// Handle search-input focus and blur events
document.getElementById('search-input').addEventListener('focus', function() {
  // Clear placeholder text when input is focused
  this.setAttribute('placeholder', '');
});

document.getElementById('search-input').addEventListener('blur', function() {
  // Restore placeholder text when input loses focus and is empty
  if (this.value === '') {
    this.setAttribute('placeholder', 'Search');
  }
});

/**
 * Navigates to the collect page
 */
function onCollect() {
  location.href = 'collect.html';
}

// jQuery document ready function
$(function () {
  // Handle pagination clicks
  $('.list-page .page a').click(function(){
    var page = parseInt($('.list-page .page a.cur').text());
    var curi = page;
    
    // Determine which page to navigate to
    if($(this).hasClass('prev')){
      if(page > 1){
        page--;
      }
    }else if($(this).hasClass('next')){
      if(page < $('.list-page .page a').length - 2){
        page++;
      }
    }else{
      page = parseInt($(this).text());
    }
    
    // Update pagination and show corresponding content if page has changed
    if(page != curi){
      $('.list-page .page a').removeClass('cur').eq(page).addClass('cur');
      $('.list-page .list').hide().eq(page - 1).fadeIn();
    }
  });
});

/**
 * References:
 * W3Schools. (n.d.). Window alert(). https://www.w3schools.com/jsref/met_win_alert.asp
 * MDN Web Docs. (n.d.). Element.setAttribute(). https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
 * Stack Overflow. (2014). Simple pagination in JavaScript. https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript
 */
