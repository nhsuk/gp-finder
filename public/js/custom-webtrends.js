(function (global) {
  "use strict"
  var $ = global.jQuery;
  var document = global.document;

  $(document).ready(function () {
    $('.details__summary').on('touchstart click', function () {
      // Webtrends is added asynchronously via DOM manipulation so must be accessed directly
      // rather than setting to a local variable as document and jQuery are above
      if (global.Webtrends) {
        global.Webtrends.multiTrack({ argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121'] });
      }
    });
    $('.results__item h3 a').on('touchstart click', function () {
      // see comment above
      if (global.Webtrends) {
        global.Webtrends.multiTrack({ argsa: ['DCSext.GPAppClick', $(this).text(), 'DCSext.GPAppRank', $(this).parents(".results__item").data('index'), 'WT.dl', '121'] });
      }
    });
  });
})(window);
