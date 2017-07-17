const postcodeValidator = require('../lib/postcodeValidator');
const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');

// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function outsideEngland(outcodeDetails) {
  return !outcodeDetails.country.includes('England');
}

function lookupPostcode(req, res, next) {
  const postcode = res.locals.postcode;

  log.debug({ postcode }, 'lookupPostcode');

  if (postcode) {
    if (postcodeValidator.isOutcode(postcode)) {
      log.debug('is outcode');
      PostcodesIO.outcode(postcode, (err, outcodeDetails) => {
        log.debug({ postcodeIOResponse: { outcodeDetails } }, 'PostcodeIO outcode response');
        if (outcodeDetails && outsideEngland(outcodeDetails)) {
          renderer.postcodeNotEnglish(postcode, req, res);
        } else if (outcodeDetails) {
          res.locals.location = { lat: outcodeDetails.latitude, lon: outcodeDetails.longitude };
          res.locals.isOutcode = true;
          next();
        } else if (!err) {
          renderer.invalidPostcodePage(postcode, req, res);
        } else {
          renderer.postcodeError(err, outcodeDetails, res, next);
        }
      });
    } else if (postcodeValidator.isPostcode(postcode)) {
      log.debug('is postcode');
      PostcodesIO.lookup(postcode, (err, postcodeDetails) => {
        log.debug({ postcodeIOResponse: { postcodeDetails } }, 'PostcodeIO postcode response');
        if (postcodeDetails && postcodeDetails.country === 'England') {
          res.locals.location = { lat: postcodeDetails.latitude, lon: postcodeDetails.longitude };
          next();
        } else if (postcodeDetails && postcodeDetails.country !== 'England') {
          renderer.postcodeNotEnglish(postcode, req, res);
        } else {
          renderer.postcodeError(err, postcodeDetails, res, next);
        }
      });
    } else {
      log.debug('not valid outcode or postcode');
      next();
    }
  } else {
    log.debug('no postcode');
    next();
  }
}

module.exports = lookupPostcode;
