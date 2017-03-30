// eslint-disable-next-line new-cap
const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const searchValidator = require('../app/middleware/searchValidator');
const getGps = require('../app/middleware/getGps');
const logZeroResults = require('../app/middleware/logZeroResults');

router.get('/results',
  setLocals.fromRequest,
  searchValidator,
  getGps,
  logZeroResults,
  renderer.results
);

router.get('/',
  setLocals.fromRequest,
  renderer.searchForYourGp
);

module.exports = router;
