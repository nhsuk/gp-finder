const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const searchValidator = require('../lib/searchValidator');

function setSearchLabel(res) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchLabel = "What's your GP surgery's name - error?";
}

function validateSearch(req, res, next) {
  const search = res.locals.search;

  log.info('validate-search-start');
  const validationResult = searchValidator.validateSearch(search);
  log.info('validate-search-end');

  // eslint-disable-next-line no-param-reassign
  res.locals.search = validationResult.input;

  if (validationResult.errorMessage) {
    log.info({ search }, 'Search failed validation');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    if (searchValidator.isEmpty(search)) { setSearchLabel(res); }
    renderer.searchForYourGp(req, res);
  } else {
    next();
  }
}

module.exports = validateSearch;
