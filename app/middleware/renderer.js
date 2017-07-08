const messages = require('../lib/messages');
const postcodeValidator = require('../lib/postcodeValidator');
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
  log.info({ postcode }, 'Location outside of England');
  const postcodeHash = { isOutcode: postcodeValidator.isOutcode(postcode), term: postcode };
  res.locals.outOfEnglandMessage = messages.outOfEnglandMessage(postcodeHash, res.locals.search);
  results(req, res);
}

function setInvalidPostcodeLabel(res, postcode) {
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist`;
  res.locals.searchErrorClass = 'postcode';
  res.locals.errorMessage = messages.invalidPostcodeMessage();
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
