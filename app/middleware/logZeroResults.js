const log = require('../lib/logger');

function logZeroResults(req, res, next) {
  const location = res.locals.location;

  if (res.locals.gps.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
  }

  next();
}

module.exports = logZeroResults;
