const gpLookup = require('../lib/gpLookup');

function setGps(req, res, next) {
  /* eslint-disable no-param-reassign*/
  res.locals.gps = Object.values(gpLookup());
  /* eslint-enable no-param-reassign*/
  next();
}

module.exports = setGps;
