const log = require('../lib/logger');

function logZeroResults(req, res, next) {
  const search = res.locals.search;
  const postcode = res.locals.postcode;

  if (res.locals.gps.length === 0) {
    log.warn({ search }, `No results were found for: { search: '${search}', postcode: '${postcode}'`);
  }

  next();
}

module.exports = logZeroResults;
