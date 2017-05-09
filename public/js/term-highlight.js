jQuery(function($) {
  $(document).ready(function () {
    if ($('h1.sr-only').data('term')){
      var terms = $('h1.sr-only').data('term').split(/\W+/);
      terms.push($('h1.sr-only').data('term'));
      $('.results__item').each(function(){
        var src_str = $(this).html();
        var results_item = $(this)
        $.each(terms, function(_, term){
          term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
          var pattern = new RegExp("("+term+")", "gi");

          src_str = src_str.replace(pattern, '<span class="highlight">$1</span>');
          src_str = src_str.replace(/(<span class="highlight">[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,'$1</span>$2<span class="highlight">$4');

          $(results_item).html(src_str);

        });
      });
    }
  });
});
