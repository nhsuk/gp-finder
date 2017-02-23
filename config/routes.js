// eslint-disable-next-line new-cap
const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const log = require('../app/middleware/logger');
const searchValidator = require('../app/middleware/searchValidator');
const getGps = require('../app/middleware/getGps');
const logZeroResults = require('../app/middleware/logZeroResults');

router.get('/results',
  log.info,
  setLocals.fromRequest,
  searchValidator,
  getGps,
  logZeroResults,
  renderer.results
);

router.get('/',
  log.info,
  setLocals.fromRequest,
  renderer.searchForYourGp
);

module.exports = router;
