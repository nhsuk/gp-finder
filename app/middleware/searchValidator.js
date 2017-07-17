const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const messages = require('../lib/messages');

function isEmptySearch(searchTermName, searchTermPostcode) {
  return (!(searchTermName) && !(searchTermPostcode));
}

function validateSearch(req, res, next) {
  const searchTermName = res.locals.search;
  const searchTermPostcode = res.locals.postcode;

  if (isEmptySearch(searchTermName, searchTermPostcode)) {
    log.info('Empty Search');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = messages.emptySearch();
    // eslint-disable-next-line no-param-reassign
    res.locals.searchErrorLabel = 'You need to enter some text';
    // eslint-disable-next-line no-param-reassign
    res.locals.searchErrorClass = 'blank';
    renderer.searchForYourGp(req, res);
  } else {
    next();
  }
}

module.exports = validateSearch;
