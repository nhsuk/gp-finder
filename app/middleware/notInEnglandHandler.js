const log = require('../lib/logger');

function outsideEngland(country) {
  return !(Array.isArray(country) ?
    country.includes('England') :
    country === 'England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.location;

  log.debug({ location }, 'notInEnglandHandler');

  if (outsideEngland(location.country)) {
    renderer.postcodeNotEnglish(location.postcode, req, res);
  } else {
    next();
  }
}


module.exports = notInEnglandHandler;
