const VError = require('verror').VError;
const log = require('../lib/logger');
const gpDataMapper = require('../lib/utils/gpDataMapper');
const resultsFormat = require('../lib/utils/resultsHeaderFormater');
const elasticsearchClient = require('../lib/elasticsearchClient');
const esQueryBuilder = require('../lib/esQueryBuilder');
const esGeoQueryBuilder = require('../lib/esGeoQueryBuilder');

function handleError(error, next) {
  const errMsg = 'Error with ES';

  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}

function mapResults(results, res, searchTerm) {
  // eslint-disable-next-line no-param-reassign
  res.locals.gps = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const gp = result._source;

    // eslint-disable-next-line no-param-reassign
    gp.bookOnlineLink = gpDataMapper.getBookOnlineLink(gp);
    // eslint-disable-next-line no-param-reassign
    gp.filterGps = gpDataMapper.mappedTitleForGps(gpDataMapper.getFilteredGps(gp, searchTerm));

    if (result.sort) {
      gp.distance = result.sort[0];
    }

    return gp;
  });
  res.locals.resultsHeader = resultsFormat.pluraliseSurgeryQuestion(res.locals.gps.length);
  res.locals.resultsSubHeader = resultsFormat.pluraliseSurgery(res.locals.gps.length, searchTerm);
}

function getGps(req, res, next) {
  const searchTerm = res.locals.search;
  let esQuery;

  if (res.locals.location) {
    esQuery = esGeoQueryBuilder.build(res.locals.location, searchTerm);
  } else {
    esQuery = esQueryBuilder.build(searchTerm);
  }

  elasticsearchClient
    .search(esQuery)
    .then(results => mapResults(results, res, searchTerm))
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGps;
