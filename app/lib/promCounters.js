const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ name: 'app_starts', help: 'The number of times the application has been started' }),
  errorPageViews: new promClient.Counter({ name: 'error_page_views', help: 'The number of error page views' }),
};
