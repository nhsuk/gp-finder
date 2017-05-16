const MongoClient = require('mongodb').MongoClient;
const log = require('../lib/logger');
const gpDataMapper = require('../lib/utils/gpDataMapper');
const resultsFormat = require('../lib/utils/resultsHeaderFormater');
const config = require('../../config/config').mongodb;
const VError = require('verror').VError;

function handleError(error, next) {
  const errMsg = 'Error with MongoDB search';
  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}

function closeDb(db) {
  return db.close();
}

function mapResults(db, res, documents, searchTerm) {
  log.debug(`Found ${documents.length} results for search term ${searchTerm}`);

  // eslint-disable-next-line no-param-reassign
  res.locals.gps = documents.map((gp) => {
    // eslint-disable-next-line no-param-reassign
    gp.bookOnlineLink = gpDataMapper.getBookOnlineLink(gp);
    // eslint-disable-next-line no-param-reassign
    gp.filterGps = gpDataMapper.mappedTitleForGps(gpDataMapper.getFilteredGps(gp, searchTerm));
    return gp;
  });
  res.locals.resultsHeader = resultsFormat.pluraliseSurgeryQuestion(res.locals.gps.length);
  res.locals.resultsSubHeader = resultsFormat.pluraliseSurgery(res.locals.gps.length, searchTerm);

  return db;
}

function runQuery(db, res, connectionString) {
  log.info(`Connected to ${connectionString}`);

  const collection = db.collection(config.collection);
  const searchTerm = res.locals.search;
  return collection.find({ $text: { $search: `${searchTerm}` } },
    { score: { $meta: 'textScore' } }
    ).sort(
    { score: { $meta: 'textScore' }, name: 1 }
    )
    .limit(30)
    .toArray()
    .then(documents => mapResults(db, res, documents, searchTerm));
}

function getGps(req, res, next) {
  const connectionString = config.connectionString;

  MongoClient.connect(connectionString)
    .then(db => runQuery(db, res, connectionString))
    .then(db => closeDb(db))
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getGps;

