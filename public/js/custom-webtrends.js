jQuery(function($) {
  $(document).ready(function () {
    $('.details__summary').on('touchstart click', function () {
      Webtrends.multiTrack({argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121']});
    });
  });
});
