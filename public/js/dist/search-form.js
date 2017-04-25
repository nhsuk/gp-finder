'use strict';

/* global $,Rx */

function updatePage(html) {
  $('#searchResults').html(html);
}

function handleError() {
  $('#searchResults').html('<h2>Error retrieving results</h2>');
}

function clearSearch() {
  $('#searchResults').html('');
}

function disableFormElements() {
  $('#searchForm').submit(function () {
    return false;
  });
  $('.form-group--submit').remove();
  $('.hr--higher').remove();
}

function removeWhitespace(text) {
  return text.replace(/^\s+|\s+$/gm, '');
}

function getSearchObservable() {
  var searchInput = $('#search')[0];
  return Rx.DOM.keyup(searchInput);
}

function createSearchObservable() {
  var inputEvents = getSearchObservable().pluck('target', 'value').map(removeWhitespace).debounce(500);

  inputEvents.filter(function (text) {
    return text.length === 0;
  }).subscribe(clearSearch);

  var words = inputEvents.filter(function (text) {
    return text.length > 2;
  }).distinctUntilChanged();
  return words;
}

function subscribeToFieldChange(siteRoot) {
  function callApi(term) {
    $.get(siteRoot + '/results', { search: term }, updatePage).fail(handleError);
    return term;
  }
  createSearchObservable().subscribe(callApi, handleError);
}

// eslint-disable-next-line no-unused-vars
function enableSPA(siteRoot) {
  disableFormElements();
  subscribeToFieldChange(siteRoot);
}