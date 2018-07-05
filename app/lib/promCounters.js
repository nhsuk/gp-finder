const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
};
