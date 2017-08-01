const log = require('../lib/logger');

function outsideEngland(countries) {
  return !countries.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;
  const postcodeSearch = res.locals.postcodeSearch;

  if (location && outsideEngland(location.countries)) {
    log.debug({ location }, 'Outside of England');
    res.redirect(`outside-england?postcode=${postcodeSearch}&isOutcode=${location.isOutcode}`);
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
