const expressPromBundle = require('express-prom-bundle');
const buckets = require('./constants').promHistogramBuckets;

const promBundle = expressPromBundle({ buckets, includePath: true });

module.exports = {
  middleware: promBundle,
  promClient: promBundle.promClient,
};
