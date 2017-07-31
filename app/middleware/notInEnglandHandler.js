const log = require('../lib/logger');
const renderer = require('./renderer');

function outsideEngland(country) {
  return !country.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;
  const postcodeSearch = res.locals.postcodeSearch;

  if (location && outsideEngland(location.country)) {
    log.debug({ location }, 'Outside of England');
    renderer.postcodeNotEnglish(postcodeSearch, req, res);
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
