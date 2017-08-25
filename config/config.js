const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'gp-finder',
  },
  cacheTimeoutSeconds: process.env.CACHE_TIMEOUT_SECONDS || 0,
  env: process.env.NODE_ENV || 'development',
  root: rootPath,
  newRelicLicenceKey: process.env.NEW_RELIC_LICENCE_KEY,
  port: process.env.PORT || 3000,
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
  },
  resultsLimit: process.env.RESULTS_LIMIT || 30,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
};
