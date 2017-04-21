function updatePage(html) {
  $('#searchResults').html(html);
  $('.results__subheader').remove();
}

function handleError(err) {
  $('#searchResults').html('<p>We have problems retrieving results. Please try again later.</p>');
}

function clearSearch() {
  $('#searchResults').html('');
}

function disableAndPrepFormElements() {
  var searchForm = $('#searchForm').submit(function () { return false; });
  $('.form-group--submit').remove();
  $('.hr--higher').remove();
  $('#search').attr('placeholder', 'Start typing to see results...');
}

function removeWhitespace(text) {
  return text.replace(/^\s+|\s+$/gm,'');
}

function createSearchObservable() {
  var searchInput = $('#search')[0];

  var inputEvents = Rx.DOM.keyup(searchInput)
    .pluck('target', 'value').map(removeWhitespace).debounce(500);

  var noText = inputEvents
    .filter(function (text) { return text.length == 0; })
    .subscribe(clearSearch);

  var words = inputEvents
    .filter(function (text) { return text.length > 2; })
    .distinctUntilChanged();


  return words;
}

function subscribeToFieldChange(siteRoot) {
  function callApi(term) {
    $.get(siteRoot + '/results', { search: term }, updatePage).fail(handleError);
    return term;
  }
  createSearchObservable().subscribe(callApi, handleError);
}

function enableSPA(siteRoot) {
  disableAndPrepFormElements();
  subscribeToFieldChange(siteRoot);
}


