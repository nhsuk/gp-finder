const log = require('../lib/logger');

function info(req, res, next) {
  log.info({ req });
  next();
}

module.exports = {
  info,
};
