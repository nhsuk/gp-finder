const log = require('../lib/logger');
const postcodeValidator = require('../lib/postcodeValidator');
const renderer = require('./renderer');
const PostcodesIOClient = require('postcodesio-client');

const PostcodesIO = new PostcodesIOClient();

function handleError(error, postcode, res, next) {
  renderer.postcodeError(error, postcode, res, next);
}

function render(result, postcode, req, res, next) {
  if (!result) {
    renderer.invalidPostcodePage(postcode, req, res);
  } else {
    next();
  }
}

function validatePostcode(req, res, next) {
  const postcode = res.locals.postcode;

  if (postcodeValidator.isOutcode(postcode)) {
    log.info('validate-outcode-skip');
    next();
  } else {
    log.info('validate-postcode-start');
    PostcodesIO
      .validate(postcode)
      .then(result => render(result, postcode, req, res, next))
      .catch(error => handleError(error, postcode, res, next));
    log.info('validate-postcode-end');
  }
}

module.exports = (req, res, next) => {
  if (res.locals.postcode) {
    validatePostcode(req, res, next);
  } else {
    next();
  }
};
