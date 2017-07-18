const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');

// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function outsideEngland(postcodeDetails) {
  return !(Array.isArray(postcodeDetails.country) ?
    postcodeDetails.country.includes('England') :
    postcodeDetails.country === 'England');
}

function isOutcode(postcodeDetails) {
  return !postcodeDetails.postcode;
}

function lookupPostcode(req, res, next) {
  const postcode = res.locals.postcode;

  log.debug({ postcode }, 'lookupPostcode');

  if (postcode) {
    PostcodesIO.lookup(postcode, (err, postcodeDetails) => {
      log.debug({ postcodeIOResponse: { postcodeDetails } }, 'PostcodeIO postcode response');

      if (err) {
        renderer.postcodeError(err, postcode, res, next);
      } else if (postcodeDetails) {
        res.locals.isOutcode = isOutcode(postcodeDetails);
        if (outsideEngland(postcodeDetails)) {
          renderer.postcodeNotEnglish(postcode, req, res);
        } else {
          res.locals.location = { lat: postcodeDetails.latitude, lon: postcodeDetails.longitude };
          log.debug({ isOutcode: res.locals.isOutcode, location: res.locals.location });
          next();
        }
      } else {
        renderer.invalidPostcodePage(postcode, req, res);
      }
    });
  } else {
    log.debug('no postcode');
    next();
  }
}

module.exports = lookupPostcode;
