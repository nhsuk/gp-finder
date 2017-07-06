const postcodeValidator = require('../lib/postcodeValidator');
const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');

// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function outsideEngland(outcodeDetails) {
  return !outcodeDetails.country.some(c => c === 'England');
}

function lookupPostcode(req, res, next) {
  const postcode = res.locals.postcode;

  if (postcodeValidator.isOutcode(postcode)) {
    PostcodesIO.outcode(postcode, (err, outcodeDetails) => {
      if (outcodeDetails && outsideEngland(outcodeDetails)) {
        log.info('validate-outcode-notEnglish');
        renderer.postcodeNotEnglish(postcode, req, res);
        log.info('validate-outcode-notEnglish');
      } else if (outcodeDetails) {
        res.locals.location = { lat: outcodeDetails.latitude, lon: outcodeDetails.longitude };
        res.locals.isOutcode = true;
        log.info(`outcode ${JSON.stringify(res.locals.location)}`);
        next();
      } else if (!err) {
        log.info('validate-outcode-invalid');
        renderer.invalidPostcodePage(postcode, req, res);
        log.info('validate-outcode-end');
      } else {
        log.info('lookup-outcode-error');
        renderer.postcodeError(err, outcodeDetails, res, next);
        log.info('lookup-outcode-error');
      }
    });
  } else if (postcodeValidator.isPostcode(postcode)) {
    PostcodesIO.lookup(postcode, (err, postcodeDetails) => {
      if (postcodeDetails && postcodeDetails.country === 'England') {
        res.locals.location = { lat: postcodeDetails.latitude, lon: postcodeDetails.longitude };
        log.info(`lookup ${JSON.stringify(res.locals.location)}`);
        next();
      } else if (postcodeDetails && postcodeDetails.country !== 'England') {
        log.info('validate-postcode-notEnglish');
        renderer.postcodeNotEnglish(postcode, req, res);
        log.info('validate-postcode-notEnglish');
      } else {
        log.info('lookup-postcode-error');
        renderer.handlePostcodeError(err, postcodeDetails, res, next);
        log.info('lookup-postcode-error');
      }
    });
  } else {
    next();
  }
}

module.exports = lookupPostcode;
