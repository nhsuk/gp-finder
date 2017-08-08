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

    if (gp) {
      // eslint-disable-next-line no-param-reassign
      gp.bookOnlineLink = gpDataMapper.getBookOnlineLink(gp);

      if (searchTerm) {
        // eslint-disable-next-line no-param-reassign
        gp.filterGps = gpDataMapper.mappedTitleForGps(gpDataMapper.getFilteredGps(gp, searchTerm));
      }

      if (result.sort) {
        gp.distance = result.sort[0];
      }
    }

    return gp;
  });
  res.locals.resultsHeader = resultsFormat.pluraliseSurgeryQuestion(res.locals.gps.length);
  res.locals.resultsSubHeader = resultsFormat.pluraliseSurgery(res.locals.gps.length, searchTerm);
}

function getEsQuery(postcodeLocationDetails, searchTerm, size) {
  return (postcodeLocationDetails) ?
    esGeoQueryBuilder.build(postcodeLocationDetails.location, searchTerm, size) :
    esQueryBuilder.build(searchTerm, size);
}

function getGps(req, res, next) {
  const searchTerm = res.locals.search;
  const postcode = res.locals.postcodeSearch;
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const postcodeLocationDetails = res.locals.postcodeLocationDetails;
  const esQuery = getEsQuery(postcodeLocationDetails, searchTerm, resultsLimit);

  elasticsearchClient
    .search(esQuery)
    .then((results) => {
      log.info({
        postcode,
        searchTerm,
        postcodeLocationDetails,
        esQuery,
        resultCount: results.hits.total
      }, 'getGps');
      // eslint-disable-next-line no-param-reassign
      res.locals.resultsCount = results.hits.total;
      mapResults(results, res, searchTerm);
    })
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGps;
