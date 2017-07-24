const messages = require('../lib/messages');
const log = require('../lib/logger');

function results(req, res) {
  res.render('results');
}

function searchForYourGp(req, res) {
  res.render('search-for-your-gp');
}

function postcodeError(error, postcode, res, next) {
  log.info({ postcode }, 'Error with postcode validation');
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function postcodeNotEnglish(postcode, req, res) {
  const postcodeHash = { isOutcode: res.locals.postcodeLocationDetails.isOutcode, term: postcode };
  log.info({ postcodeHash }, 'Location outside of England');
  res.locals.outOfEnglandMessage = messages.outOfEngland(postcodeHash, res.locals.search);
  res.render('outside-england');
}

function setInvalidPostcodeLabel(res, postcode) {
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist`;
  res.locals.searchErrorClass = 'postcode';
  res.locals.errorMessage = messages.invalidPostcode();
}

function invalidPostcodePage(postcode, req, res) {
  log.info({ postcode }, 'Location failed validation');
  setInvalidPostcodeLabel(res, postcode);
  searchForYourGp(req, res);
}

module.exports = {
  results,
  searchForYourGp,
  postcodeError,
  postcodeNotEnglish,
  invalidPostcodePage
};
