jQuery(function($) {
  $(document).ready(function () {
    var searchTerm = $('h1.sr-only').data('term');
    $('.results__item').each(function(){
      var src_str = $(this).html();
      searchTerm = searchTerm.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
      var pattern = new RegExp("("+searchTerm+")", "gi");

      src_str = src_str.replace(pattern, '<span class="highlight">$1</span>');
      src_str = src_str.replace(/(<span class="highlight">[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,'$1</span>$2<span class="highlight">$4');

      $(this).html(src_str);
    });
  });
});
