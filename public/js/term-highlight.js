jQuery(function($) {
  $(document).ready(function () {

    if ($('h1.sr-only').attr('data-term')){
      var searchTerm = $('h1.sr-only')
        .data('term')
        .toLowerCase()
        .replace(/[".]/g,'')     // remove speech mark
        .replace(/[;]/g,'')      // remove special characters
        .replace('doctor','dr'); // Change Doctor to Dr

      var terms = searchTerm.split(' ');

      for (var i = 0, len = terms.length; i < len-1; i++) {
        terms.push(terms[i]+' '+terms[i+1]);
      }

      if ($.inArray( searchTerm, terms ) === -1){
        terms.push(searchTerm);
      }

      terms.forEach(function(term, index){
        if(term.length >= 3) {
          $('ol.results').mark(term, {
            "wildcards": "withSpaces",
            "ignoreJoiners": true,
            "acrossElements": true,
            "separateWordSearch": false,
            "element": "em",
            "className": "highlight",
            "accuracy": "exact",
            "exclude": ["section *"]
          });
        }
      });
    }
  });
});
