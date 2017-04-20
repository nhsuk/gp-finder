
function updatePage(html) {
  $("#searchResults").html(html);
}

function handleError(err) {
   $("#searchResults").html('<h2>Error retrieving results</h2>');
}

function disableFormElements() {
  var searchForm = $('#searchForm').submit(function () { return false; });
  $('.form-group--submit').remove();
  $('.hr--higher').remove();
}

function createSearchObservable() {
  var searchInput = $('#search')[0];

  var throttledInput = Rx.DOM.keyup(searchInput)
    .pluck('target', 'value')
    .filter(function (text) { return text.length > 2; })
    .debounce(500)
    .distinctUntilChanged();

  return throttledInput;
}

function subscribeToFieldChange(siteRoot) {
  function callApi(term) {
    $.get(siteRoot + '/results', { search: term }, updatePage).fail(handleError);
    return term;
  }
  createSearchObservable().subscribe(callApi, handleError);
}

function enableSPA(siteRoot) {
  disableFormElements();
  subscribeToFieldChange(siteRoot);
}


