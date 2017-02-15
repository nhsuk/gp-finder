const gpLookup = require('../lib/gpLookup');

function setGps(req, res, next) {
  /* eslint-disable no-param-reassign*/
  gpsHash = gpLookup();
  var gps = new Array();

  for (var key in gpsHash) {
    gps.push(gpsHash[key]);
  }

  res.locals.gps = gps;

  console.log(gps.inspect);
  /* eslint-enable no-param-reassign*/
  next();
}

module.exports = setGps;
