const messages = require('../lib/messages');
const log = require('../lib/logger');

function setSearchLabel(res, postcode) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist.`;
}

function handlePostcodeError(error, postcode, res, next) {
  const errMsg = 'Error with postcode validation';

  const errorMessage = messages.technicalProblems;
  log.info({ postcode }, errMsg);
  res.locals.errorMessage = errorMessage;
  next(error);
}

function postcodeNotEnglish(renderer, req, res) {
  log.info(`Rendering no results page for non-english postcode '${res.locals.processedSearch}'`);
  /* eslint-enable no-param-reassign*/
  res.locals.nonEngland = true;
  renderer.results(req, res);
}

function invalidPostcode(postcode, renderer, req, res) {
  const errorMessage = messages.invalidPostcodeMessage(postcode);
  log.info({ postcode }, 'Location failed validation');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = errorMessage;
  setSearchLabel(res, postcode);
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
  invalidPostcode,
  postcodeNotEnglish,
  handlePostcodeError
};
