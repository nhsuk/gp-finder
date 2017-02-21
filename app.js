const log = require('./app/lib/logger');
const app = require('./server');

app.listen(app.port, () => {
  log.info(`Express server listening on port ${app.port}`);
});

module.exports = app;
