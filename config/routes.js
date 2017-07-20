// eslint-disable-next-line new-cap
const router = require('express').Router();
const preRender = require('../app/middleware/preRender');
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const stripWhitespace = require('../app/middleware/stripWhitespace');
const searchValidator = require('../app/middleware/searchValidator');
const postcodeLookup = require('../app/middleware/postcodeLookup');
const getGps = require('../app/middleware/getGps');
const logZeroResults = require('../app/middleware/logZeroResults');

router.get('/results',
  setLocals.fromRequest,
  stripWhitespace,
  searchValidator,
  postcodeLookup,
  getGps,
  logZeroResults,
  preRender,
  renderer.results
);

router.get('/',
  setLocals.fromRequest,
  renderer.searchForYourGp
);

module.exports = router;
