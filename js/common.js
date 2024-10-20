

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

$(function () {
  $('.list-page .page a').click(function(){
    var page = parseInt($('.list-page .page a.cur').text());
    var curi = page;
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
    if(page != curi){
      $('.list-page .page a').removeClass('cur').eq(page).addClass('cur');
      $('.list-page .list').hide().eq(page - 1).fadeIn();
    }
  });
});

// $(function () {
//   $('.map-item').click(function () {
//     $('.map-tips,.right-info').toggle();
//   });
//   $('.map-tips .tips-msg').click(function () {
//     alert('播放')
//   });
// });