const log = require('../lib/logger');
// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function outsideEngland(country) {
  return !country.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;
  const postcodeSearch = res.locals.postcodeSearch;

  log.debug({ location }, 'notInEnglandHandler');

  if (location) {
    if (outsideEngland(location.country)) {
      renderer.postcodeNotEnglish(postcodeSearch, req, res);
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
