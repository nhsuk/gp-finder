jQuery(function($) {
  $(document).ready(function () {
    $('.details__summary').on('touchstart click', function () {
      Webtrends.multiTrack({argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121']});
    });
    $('.results__item h3 a').on('touchstart click', function () {
      Webtrends.multiTrack({argsa: ['DCSext.GPAppClick', $(this).text(), 'DCSext.GPAppRank', $(this).parents(".results__item").data('index'), 'WT.dl', '121']});
    });
  });
});
