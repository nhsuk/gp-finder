jQuery(function($) {
  $(document).ready(function () {
    $('.not-registered').on('toggle', function () {
      Webtrends.multiTrack({argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121']});
    });
  });
});
