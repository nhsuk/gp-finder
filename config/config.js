const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'gp-finder',
  },
  cacheTimeoutSeconds: process.env.CACHE_TIMEOUT_SECONDS || 0,
  env: process.env.NODE_ENV || 'development',
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
  },
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  port: process.env.PORT || 3000,
  resultsLimit: process.env.RESULTS_LIMIT || 30,
  root: rootPath,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
};
