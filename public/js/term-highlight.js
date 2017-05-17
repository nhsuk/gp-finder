jQuery(function($) {
  $(document).ready(function () {
    var searchTerm = $('h1.sr-only').data('term').toLowerCase();
        // remove speach mark
        searchTerm = searchTerm.replace(/[".]/g,'');
        // remove special characters
        searchTerm = searchTerm.replace(/[;]/g,'');
        // Change Doctor to Dr
        searchTerm = searchTerm.replace('doctor','dr');

    var terms = searchTerm.split(' ');

    for (var i = 0, len = terms.length; i < len-1; i++) {
      terms.push(terms[i]+' '+terms[i+1]);
    }

    if ($.inArray( searchTerm, terms ) === -1){
      terms.push(searchTerm);
    }

    terms.forEach(function(term, index){
      if(term.length >= 3) {
        $('.results').mark(term, {
          "wildcards": "withSpaces",
          "ignoreJoiners": true,
          "acrossElements": true,
          "separateWordSearch": false,
          "element": "em",
          "className": "highlight"
        });
      }
    });
  });
});
