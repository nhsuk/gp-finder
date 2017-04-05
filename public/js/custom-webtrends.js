jQuery(function($) {
  $(document).ready(function () {
    $('.not-registered').on('toggle', function () {
      // dcsMultiTrack('DCSext.GPAppointment', 'Not_Registered', 'WT.dl', '121');
      Webtrends.multiTrack({
        element: $(this),
        argsa: ['GPAppointment', 'Not_Registered', 'WT.dl', '121']
      });
    });
  });
});