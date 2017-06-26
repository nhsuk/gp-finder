const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const postcodeValidator = require('../lib/postcodeValidator');
const isNotEnglishPostcode = require('../lib/isNotEnglishPostcode');
const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function handleError(error, postcode, res, next) {
  postcodeValidator.handlePostcodeError(error, postcode, res, next);
}

function validatePostcode(result, postcode, rendererParam, req, res, next) {
  if (!result) {
    postcodeValidator.invalidPostcode(postcode, rendererParam, req, res);
  } else {
    next();
  }
}

function validateEnglishLocation(rendererParam, req, res, next) {
  const postcode = res.locals.processedSearch;

  if (postcodeValidator.isOutcode(postcode)) {
    log.info('validate-outcode-skip');
    next();
  } else {
    log.info('validate-location-start');
    postcodes
      .validate(postcode)
      .then(result => validatePostcode(result, postcode, rendererParam, req, res, next))
      .catch(error => handleError(error, postcode, res, next));
    log.info('validate-location-end');
  }
}

function validateLocation(req, res, next) {
  if (res.locals.postcode === res.locals.processedSearch) {
    const rendererParam = renderer;
    if (isNotEnglishPostcode(res.locals.postcode)) {
      postcodeValidator.postcodeNotEnglish(rendererParam, req, res);
    } else {
      validateEnglishLocation(rendererParam, req, res, next);
    }
  } else {
    next();
  }
}

module.exports = {
  validateLocation
};
