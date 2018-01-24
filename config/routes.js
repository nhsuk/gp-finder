// eslint-disable-next-line new-cap
const router = require('express').Router();
const preRender = require('../app/middleware/preRender');
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const stripWhitespace = require('../app/middleware/stripWhitespace');
const searchValidator = require('../app/middleware/searchValidator');
const postcodeLookup = require('../app/middleware/postcodeLookup');
const notInEnglandHandler = require('../app/middleware/notInEnglandHandler');
const getGps = require('../app/middleware/getGps');

router.get(
  '/results',
  setLocals.fromRequest,
  stripWhitespace,
  searchValidator,
  postcodeLookup,
  notInEnglandHandler,
  getGps,
  preRender,
  renderer.results
);

router.get(
  '/outside-england',
  renderer.postcodeNotEnglish
);

router.get(
  '/search-for-your-gp',
  setLocals.fromRequest,
  renderer.searchForYourGp
);

router.get(
  '/',
  setLocals.fromRequest,
  renderer.start
);

module.exports = router;
