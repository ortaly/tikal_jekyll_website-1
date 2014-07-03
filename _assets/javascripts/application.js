//= require vendor/jquery-2.1.1
//= require vendor/jquery.validate.js
//= require vendor/scrollup/jquery.scrollUp
//= require vendor/drupal_legacy.js
//= require vendor/angular.min.js
//= require meetup_events.js
//= require contact.js

$('document').ready(function() {
  $("#core-values .double-field-first").click(function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active").parents(".field-item").find(".double-field-second").slideUp();
    } else {
      $(this).addClass("active").parents(".field-item").find(".double-field-second").slideDown();
    }
  });

  $.scrollUp();

  // enable careers vertiavl carousel
  Drupal.behaviors.tikalScrollItems.attach();
  
  if ($('.jcarousel').length > 0) {
    var carousel = $('.jcarousel');
    var slides = carousel.find('li');
    var numberOfSlides = slides.length;
    var num = 0;
    window.setInterval(function () {
        // increase by num 1, reset to 0 at 4
        num = (num + 1) % (numberOfSlides);
        var leftPosition = -(slides.first().width() * num) + "px"; 

        carousel.find('ul').attr('style', 'left: '+leftPosition);
    }, 4000); // repeat forever, polling every 3 seconds
  }
});
