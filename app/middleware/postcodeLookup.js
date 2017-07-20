const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');

// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function getCountryAsArray(country) {
  return Array.isArray(country) ? country : [country];
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    country: getCountryAsArray(postcodeDetails.country)
  };
}

function isOutcode(postcodeDetails) {
  return postcodeDetails.postcode === undefined;
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
        res.locals.location = { lat: postcodeDetails.latitude, lon: postcodeDetails.longitude };
        res.locals.postcodeLocationDetails =
          postcodeDetailsMapper(postcodeDetails);
        next();
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
