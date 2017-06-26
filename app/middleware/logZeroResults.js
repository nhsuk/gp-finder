const log = require('../lib/logger');

function logZeroResults(req, res, next) {
  const search = res.locals.processedSearch;

  if (res.locals.gps.length === 0) {
    log.warn({ search }, `No results were found for ${search}`);
  }

  next();
}

module.exports = logZeroResults;
