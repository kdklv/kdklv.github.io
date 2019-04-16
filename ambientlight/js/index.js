window.addEventListener('devicelight', function(event) {
  if (event.value < 75) {
    $('body').addClass('dark-theme');
  } else {
    $('body').removeClass('dark-theme');
  }
});