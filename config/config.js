const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const host = 'mongo';
const port = '27017';
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
  }
};
