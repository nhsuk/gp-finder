const VError = require('verror').VError;
const log = require('../lib/logger');
const gpDataMapper = require('../lib/utils/gpDataMapper');
const resultsFormat = require('../lib/utils/resultsHeaderFormater');
const elasticsearchClient = require('../lib/elasticsearchClient');
const esQueryBuilder = require('../lib/esQueryBuilder');
const esGeoQueryBuilder = require('../lib/esGeoQueryBuilder');
const esGetGpHistogram = require('../lib/promHistograms').esGetGP;
const esQueryLabelName = require('../lib/constants').promESQueryLabelName;

function handleError(error, next) {
  const errMsg = 'Error with ES';

  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}

function mapResults(results, res, searchTerm) {
  res.locals.gps = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const gp = result._source;

    if (gp) {
      gp.leaveReviewLink = gpDataMapper.getLeaveReviewLink(res.locals.callback, gp.name);

      if (searchTerm) {
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
    {
      query: esGeoQueryBuilder.build(postcodeLocationDetails.location, searchTerm, size),
      label: 'name_and_geo'
    } : {
      query: esQueryBuilder.build(searchTerm, size),
      label: 'name_only'
    };
}

function getGps(req, res, next) {
  const searchTerm = res.locals.search;
  const postcode = res.locals.postcodeSearch;
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const postcodeLocationDetails = res.locals.postcodeLocationDetails;
  const esQuery = getEsQuery(postcodeLocationDetails, searchTerm, resultsLimit);

  const endTimer = esGetGpHistogram.startTimer();
  const timerLabel = {};
  timerLabel[esQueryLabelName] = esQuery.label;
  elasticsearchClient
    .search(esQuery.query)
    .then((results) => {
      endTimer(timerLabel);
      log.info({
        postcode,
        searchTerm,
        postcodeLocationDetails,
        esQuery,
        resultCount: results.hits.total
      }, 'getGps');
      res.locals.resultsCount = results.hits.total;
      mapResults(results, res, searchTerm);
    })
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGps;
