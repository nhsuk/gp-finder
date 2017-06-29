const messages = require('../lib/messages');
const renderer = require('../middleware/renderer');
const log = require('../lib/logger');

function setInvalidPostcodeLabel(res, postcode) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist`;
  res.locals.searchErrorClass = 'postcode';
}

function setNotEnglishPostcodeLabel(res, postcode) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchErrorLabel = `The postcode '${postcode}' is not in England`;
}

function handlePostcodeError(error, postcode, res, next) {
  log.info({ postcode }, 'Error with postcode validation');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function renderPostcodeNotEnglish(postcode, req, res) {
  log.info({ postcode }, 'Location outside of England');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = messages.notEnglishPostcodeMessage();
  setNotEnglishPostcodeLabel(res, postcode);
  renderer.searchForYourGp(req, res);
}

function renderInvalidPostcodePage(postcode, req, res) {
  log.info({ postcode }, 'Location failed validation');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = messages.invalidPostcodeMessage();
  setInvalidPostcodeLabel(res, postcode);
  renderer.searchForYourGp(req, res);
}

function isOutcode(postcode) {
  const outcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/gi;
  return postcode.match(outcodeRegex);
}

function isPostcode(postcode) {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/gi;
  return postcode.match(postcodeRegex);
}

module.exports = {
  isOutcode,
  isPostcode,
  renderInvalidPostcodePage,
  renderPostcodeNotEnglish,
  handlePostcodeError
};
