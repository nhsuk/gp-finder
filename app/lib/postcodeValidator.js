const messages = require('../lib/messages');
const log = require('../lib/logger');
const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function validatePostcode(postcode) {
  postcodes
    .validate(postcode)
    .then((result) => {
      let errorMessage = null;
      if (!result) {
        errorMessage = messages.invalidPostcodeMessage(postcode);
      }
      return {
        errorMessage,
        input: postcode,
      };
    })
    .catch((error) => {
      log.info({ error }, 'Postcode API error');
      const errorMessage = messages.technicalProblems;
      return {
        errorMessage,
        input: postcode,
      };
    });
}

module.exports = validatePostcode;
