jQuery(function($) {
  $(document).ready(function () {
    var searchTerm = $('h1.sr-only').data('term');
        // remove speach mark
        searchTerm = searchTerm.replace(/["]/g,'');
        // remove special characters
        searchTerm = searchTerm.replace(/[;]/g,'');
    console.log(searchTerm);
    $('.results').mark(searchTerm, {
        "wildcards": "withSpaces",
        "ignoreJoiners": true,
        "acrossElements": true,
        "separateWordSearch": true,
        "element": "em",
        "className": "highlight"
    });
  });
});
