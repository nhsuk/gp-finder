const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const isNotEnglishPostcode = require('../lib/isNotEnglishPostcode');
const postcodeValidator = require('../lib/postcodeValidator');

function setSearchLabel(res, postcode) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist.`;
}

function validateEnglishLocation(req, res, next) {
  const postcode = res.locals.processedSearch;

  log.info('validate-location-start');
  const validationResult = postcodeValidator(postcode);
  log.info(`validationResult - TODO turn this into a promise!!! ${validationResult}`);
  log.info('validate-location-end');

  // eslint-disable-next-line no-param-reassign
  res.locals.processedSearch = validationResult.input;

  if (validationResult.errorMessage) {
    log.info({ postcode }, 'Location failed validation');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    setSearchLabel(res, postcode);
    renderer.searchForYourGp(req, res);
  } else {
    next();
  }
}

function renderNoResultsPage(req, res) {
  log.info(`Rendering no results page for non-english postcode '${res.locals.postcode}'`);
  /* eslint-enable no-param-reassign*/
  res.locals.nonEngland = true;
  renderer.results(req, res);
}

function validateLocation(req, res, next) {
  if (res.locals.postcode === res.locals.processedSearch) {
    if (isNotEnglishPostcode(res.locals.postcode)) {
      renderNoResultsPage(req, res);
    } else {
      validateEnglishLocation(req, res, next);
    }
  } else {
    next();
  }
}

module.exports = validateLocation;
