const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const host = process.env.MONGODB_HOST || 'mongo';
const port = process.env.MONGODB_PORT || 27017;
const db = 'profiles';

module.exports = {
  app: {
    name: 'gp-finder',
  },
  env: process.env.NODE_ENV || 'development',
  root: rootPath,
  port: process.env.PORT || 3000,
  mongodb: {
    collection: 'gps',
    connectionString: `mongodb://${host}:${port}/${db}`,
  },
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
};
