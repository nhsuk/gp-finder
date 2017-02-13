const log = require('./app/lib/logger');
const app = require('./app');

app.listen(app.port, () => {
  log.info(`Express GP Finder web app listening on port ${app.port}`);
});
