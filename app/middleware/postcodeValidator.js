const log = require('../lib/logger');
const postcodeValidator = require('../lib/postcodeValidator');
const isNotEnglishPostcode = require('../lib/isNotEnglishPostcode');
const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function handleError(error, postcode, res, next) {
  postcodeValidator.handlePostcodeError(error, postcode, res, next);
}

function validatePostcode(result, postcode, req, res, next) {
  if (!result) {
    postcodeValidator.renderInvalidPostcodePage(postcode, req, res);
  } else {
    next();
  }
}

function validateEnglishLocation(req, res, next) {
  const postcode = res.locals.processedSearch;

  if (postcodeValidator.isOutcode(postcode)) {
    log.info('validate-outcode-skip');
    next();
  } else {
    log.info('validate-location-start');
    postcodes
      .validate(postcode)
      .then(result => validatePostcode(result, postcode, req, res, next))
      .catch(error => handleError(error, postcode, res, next));
    log.info('validate-location-end');
  }
}

function validateLocation(req, res, next) {
  if (res.locals.postcode === res.locals.processedSearch) {
    if (isNotEnglishPostcode(res.locals.postcode)) {
      postcodeValidator.renderPostcodeNotEnglish(req, res);
    } else {
      validateEnglishLocation(req, res, next);
    }
  } else {
    next();
  }
}

module.exports = validateLocation;
