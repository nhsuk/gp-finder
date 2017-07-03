const postcodeValidator = require('../lib/postcodeValidator');
const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');

const PostcodesIO = new PostcodesIOClient();

function lookupPostcode(req, res, next) {
  const postcode = res.locals.postcode;

  if (postcodeValidator.isOutcode(postcode)) {
    PostcodesIO.outcode(postcode, (err, outcodeDetails) => {
      if (outcodeDetails) {
        res.locals.location = { lat: outcodeDetails.latitude, lon: outcodeDetails.longitude };
        res.locals.isOutcode = true;
        log.info(`outcode ${JSON.stringify(res.locals.location)}`);
        next();
      } else if (!err) {
        log.info('validate-outcode-invalid');
        postcodeValidator.renderInvalidPostcodePage(postcode, req, res);
        log.info('validate-outcode-end');
      } else {
        log.info('lookup-outcode-error');
        postcodeValidator.handlePostcodeError(err, outcodeDetails, res, next);
        log.info('lookup-outcode-error');
      }
    });
  } else if (postcodeValidator.isPostcode(postcode)) {
    PostcodesIO.lookup(postcode, (err, postcodeDetails) => {
      if (postcodeDetails && postcodeDetails.country === 'England') {
        res.locals.location = { lat: postcodeDetails.latitude, lon: postcodeDetails.longitude };
        log.info(`lookup ${JSON.stringify(res.locals.location)}`);
        next();
      } else if (postcodeDetails && postcodeDetails.country !== 'England') {
        log.info('revalidate-postcode-notEnglish');
        postcodeValidator.renderPostcodeNotEnglish(postcodeDetails, req, res);
        log.info('revalidate-postcode-notEnglish');
      } else {
        log.info('lookup-postcode-error');
        postcodeValidator.handlePostcodeError(err, postcodeDetails, res, next);
        log.info('lookup-postcode-error');
      }
    });
  } else {
    next();
  }
}

module.exports = lookupPostcode;
