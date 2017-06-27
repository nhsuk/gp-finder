const messages = require('../lib/messages');
const renderer = require('../middleware/renderer');
const log = require('../lib/logger');

function setSearchLabel(res, postcode) {
  // eslint-disable-next-line no-param-reassign
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist.`;
}

function handlePostcodeError(error, postcode, res, next) {
  log.info({ postcode }, 'Error with postcode validation');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function renderPostcodeNotEnglish(req, res) {
  log.info(`Rendering no results page for non-english postcode '${res.locals.processedSearch}'`);
  // eslint-disable-next-line no-param-reassign
  res.locals.nonEngland = true;
  return renderer.results(req, res);
}

function renderInvalidPostcodePage(postcode, req, res) {
  log.info({ postcode }, 'Location failed validation');
  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = messages.invalidPostcodeMessage();
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
  renderInvalidPostcodePage,
  renderPostcodeNotEnglish,
  handlePostcodeError
};
