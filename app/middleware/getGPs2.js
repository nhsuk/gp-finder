const MongoClient = require('mongodb').MongoClient;
const log = require('../lib/logger');
const constants = require('../lib/constants');
const properCapitalize = require('../lib/utils/properCapitalize');
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
    gp.name = properCapitalize(gp.name);
    return gp;
  });

  return db;
}

function runQuery(db, res, connectionString) {
  log.info(`Connected to ${connectionString}`);

  const collection = db.collection(config.collection);

  const searchTerm = res.locals.search;
  //const limits = constants.numberOfNearbyResults;
  console.log(searchTerm);
  return collection.find({ name: new RegExp(searchTerm, 'i') })
   //   .limit(limits)
      .toArray()
      .then((documents) => { return mapResults(db, res, documents, searchTerm) });
}

function getGps2(req, res, next) {
  const connectionString = config.connectionString;

  MongoClient.connect(connectionString)
    .then((db) => runQuery(db, res, connectionString))
    .then((db) => closeDb(db))
    .then(next)
    .catch((error) =>handleError(error, next));
}

module.exports = getGps2;

