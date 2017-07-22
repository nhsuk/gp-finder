const log = require('../lib/logger');

function logZeroResults(req, res, next) {
  const search = res.locals.search;
  const postcodeSearch = res.locals.postcodeSearch;

  if (res.locals.gps.length === 0) {
    log.warn({ search }, `No results were found for: { search: '${search}', postcode: '${postcodeSearch}'`);
  }

  next();
}

module.exports = logZeroResults;
