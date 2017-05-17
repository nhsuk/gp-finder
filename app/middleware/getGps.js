const VError = require('verror').VError;
const log = require('../lib/logger');
const gpDataMapper = require('../lib/utils/gpDataMapper');
const elasticsearchClient = require('../lib/elasticsearchClient');
const esQueryBuilder = require('../lib/esQueryBuilder');

function handleError(error, next) {
  const errMsg = 'Error with ES';
  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}

function mapResults(results, res) {
  // eslint-disable-next-line no-param-reassign
  res.locals.gps = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const gp = result._source;
    // eslint-disable-next-line no-param-reassign
    gp.bookOnlineLink = gpDataMapper(gp);
    return gp;
  });
}

function getGps(req, res, next) {
  const searchTerm = res.locals.search;
  const esQuery = esQueryBuilder.build(searchTerm);

  elasticsearchClient
    .search(esQuery)
    .then(results => mapResults(results, res, next))
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGps;
