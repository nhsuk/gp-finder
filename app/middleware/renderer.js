const messages = require('../lib/messages');
const log = require('../lib/logger');

function results(req, res) {
  if (res.locals.gps.length > 0) {
    res.render('results');
  } else {
    res.render('no-results');
  }
}

function start(req, res) {
  res.render('start');
}

function searchForYourGp(req, res) {
  res.render('search-for-your-gp');
}

function postcodeError(error, postcode, res, next) {
  log.debug({ postcode }, 'Error in postcode');
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function postcodeNotEnglish(req, res) {
  const postcodeHash = { isOutcode: req.query.isOutcode === 'true', term: req.query.postcode };
  res.locals.outOfEnglandMessage = messages.outOfEngland(postcodeHash);
  log.debug({ query: req.query, postcodeHash, message: res.locals.outOfEnglandMessage });
  res.render('outside-england');
}

function setInvalidPostcodeLabel(res, postcode) {
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist`;
  res.locals.searchErrorClass = 'postcode';
  res.locals.errorMessage = messages.invalidPostcode();
}

function invalidPostcodePage(postcode, req, res) {
  log.debug({ postcode }, 'Location failed validation');
  setInvalidPostcodeLabel(res, postcode);
  searchForYourGp(req, res);
}

module.exports = {
  results,
  start,
  searchForYourGp,
  postcodeError,
  postcodeNotEnglish,
  invalidPostcodePage
};
