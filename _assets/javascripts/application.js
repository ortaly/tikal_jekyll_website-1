//= require vendor/jquery-2.1.1
//= require vendor/scrollup/jquery.scrollUp
//= require vendor/drupal_legacy.js
//= require vendor/angular.min.js
//= require vendor/angular-sanitize.js
//= require  meetup_events.js

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
});
