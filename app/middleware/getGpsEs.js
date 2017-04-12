const Client = require('node-rest-client-promise').Client;
const gpDataMapper = require('../lib/utils/gpDataMapper');
const log = require('../lib/logger');
const VError = require('verror').VError;

function handleError(error, next) {
  const errMsg = 'Error with Elasticsearch';
  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}
const client = new Client();

function getResultHits(res) {
  return res.data && res.data.hits && res.data.hits.hits;
}

function esQuery(index, term) {
  return client.getPromise(`http://es:9200/${index}/_search?q=${term}`).then(getResultHits);
}

function getGpsEs(req, res, next) {
  const searchTerm = res.locals.search;
  esQuery('profiles', searchTerm).then((documents) => {
      // eslint-disable-next-line no-param-reassign
    res.locals.gps = documents.map((hit) => {
      // eslint-disable-next-line no-underscore-dangle
      const gp = hit._source;
      gp.bookOnlineLink = gpDataMapper(gp);
      return gp;
    });
  }).then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGpsEs;
