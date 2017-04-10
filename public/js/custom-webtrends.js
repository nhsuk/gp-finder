jQuery(function($) {
  $(document).ready(function () {
    $('.not-registered').on('toggle', function () {
      window.Webtrends.multiTrack({argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121']});
      // Webtrends.multiTrack({
      //   element: $(this),
      //   argsa: ['DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121']
      // });
    });
  });
});