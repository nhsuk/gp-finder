const postcodeValidator = require('../lib/postcodeValidator');
const renderer = require('../middleware/renderer');
const log = require('../lib/logger');
const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function lookupPostcode(req, res, next) {
  const search = res.locals.processedSearch;

  if (postcodeValidator.isOutcode(search)) {
    postcodes.outcode(search, (err, postcode) => {
      log.info('validate-outcode-start');
      log.info(`${err} ${postcode}`);
      if (postcode) {
        res.locals.location = { lat: postcode.latitude, lon: postcode.longitude };
        next();
      } else if (!err) {
        log.info('validate-outcode-invalid');
        postcodeValidator.invalidPostcode(res.locals.processedSearch, renderer, req, res);
        log.info('validate-outcode-end');
      } else {
        log.info('lookup-outcode-error');
        postcodeValidator.handlePostcodeError(err, postcode, res, next);
        log.info('lookup-outcode-error');
      }
    });
  } else if (postcodeValidator.isPostcode(search)) {
    postcodes.lookup(search, (err, postcode) => {
      log.info(`${err} ${postcode}`);
      if (postcode && postcode.country === 'England') {
        res.locals.location = { lat: postcode.latitude, lon: postcode.longitude };
        next();
      } else if (postcode && postcode.country !== 'England') {
        log.info('revalidate-postcode-notEnglish');
        postcodeValidator.postcodeNotEnglish(renderer, req, res);
        log.info('revalidate-postcode-notEnglish');
      } else {
        log.info('lookup-postcode-error');
        postcodeValidator.handlePostcodeError(err, postcode, res, next);
        log.info('lookup-postcode-error');
      }
    });
  } else {
    next();
  }
}

module.exports = lookupPostcode;
