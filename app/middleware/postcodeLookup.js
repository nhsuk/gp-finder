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

function isOutcode(postcodeDetails) {
  return postcodeDetails.incode === undefined;
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    isOutcode: isOutcode(postcodeDetails),
    location: {
      lat: postcodeDetails.latitude,
      lon: postcodeDetails.longitude
    },
    country: getCountryAsArray(postcodeDetails.country)
  };
}

function lookupPostcode(req, res, next) {
  const postcodeSearch = res.locals.postcodeSearch;

  log.debug({ postcodeSearch }, 'lookupPostcode');

  if (postcodeSearch) {
    return PostcodesIO.lookup(postcodeSearch)
      .then((postcodeDetails) => {
        log.debug({ postcodeIOResponse: { postcodeDetails } }, 'PostcodeIO postcode response');
        if (postcodeDetails) {
          res.locals.postcodeLocationDetails =
            postcodeDetailsMapper(postcodeDetails);
          next();
        } else {
          renderer.invalidPostcodePage(postcodeSearch, req, res);
        }
      })
      .catch(error => renderer.postcodeError(error, postcodeSearch, req, res));
  }
  log.debug('no postcode');
  return next();
}

module.exports = lookupPostcode;
