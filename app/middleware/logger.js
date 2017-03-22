const log = require('../lib/logger');

function info(req, res, next) {
  log.debug({ req });
  next();
}

module.exports = {
  info,
};
