jQuery(function($) {
  $(document).ready(function () {
    var searchTerm = $('.search-term').text();
    $('.results__item').each(function(){
      var src_str = $(this).html();
      searchTerm = searchTerm.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
      var pattern = new RegExp("("+searchTerm+")", "gi");

      src_str = src_str.replace(pattern, "<mark>$1</mark>");
      src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");

      $(this).html(src_str);
    });
  });
});
