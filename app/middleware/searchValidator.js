const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const searchValidator = require('../lib/searchValidator');

function setSearchLabel(res) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchLabel = 'You need to enter some text';
}

function validateSearch(req, res, next) {
  const searchTermName = res.locals.search;
  const searchTermPostcode = res.locals.postcode;

  log.info('validate-search-start');
  const validationResult = searchValidator.checkForEmptySearch(searchTermName, searchTermPostcode);

  log.info('validate-search-end');

  // eslint-disable-next-line no-param-reassign
  res.locals.search = validationResult.input;

  if (validationResult.errorMessage) {
    log.info(validationResult.input, 'Search failed validation');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    if (!(validationResult.input)) { setSearchLabel(res); }
    renderer.searchForYourGp(req, res);
  } else {
    next();
  }
}

module.exports = validateSearch;
