const MongoClient = require('mongodb').MongoClient;
const log = require('../lib/logger');
const properCapitalize = require('../lib/utils/properCapitalize');
const config = require('../../config/config').mongodb;
const VError = require('verror').VError;

function getGps(req, res, next) {
  const connectionString = config.connectionString;

  MongoClient.connect(connectionString).then((db) => {
    log.info(`Connected to ${connectionString}`);

    const collection = db.collection(config.collection);

    const searchTerm = res.locals.search;

    collection.find({ name: new RegExp(searchTerm, 'i') }).toArray((errSearch, docs) => {
      if (errSearch) {
        const errMsg = 'MongoDB error while searching';
        log.error({ err: new VError(errSearch, errMsg) }, errMsg);
        next(errSearch);
      }

      log.debug(`Found ${docs.length} results for search term ${searchTerm}`);

      // eslint-disable-next-line no-param-reassign
      res.locals.gps = docs.map((gp) => {
        // eslint-disable-next-line no-param-reassign
        gp.name = properCapitalize(gp.name);
        return gp;
      });

      db.close((errClose, result) => {
        if (errClose) {
          const errMsg = 'MongoDB error while closing connection';
          log.error({ err: new VError(errClose, errMsg) }, errMsg);
          next(errClose);
        }
        log.debug({ result }, 'Closed MongoDB connection');
      });
      next();
    });
  }).catch((err) => {
    log.error(err.stack, `Error connecting to ${connectionString}`);
    next(err);
  });
}

module.exports = getGps;
