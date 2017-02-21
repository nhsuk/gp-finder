// eslint-disable-next-line new-cap
const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const log = require('../app/middleware/logger');
const setGps = require('../app/middleware/setGps');
const logZeroResults = require('../app/middleware/logZeroResults');

router.get('/',
  (req, res) => {
    res.redirect('find-help');
  }
);

router.get('/results',
  log.info,
  setLocals.fromRequest,
  setGps,
  logZeroResults,
  renderer.results
);

router.get('/find-help',
  log.info,
  setLocals.fromRequest,
  renderer.findHelp
);

module.exports = router;
