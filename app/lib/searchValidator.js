// const Postcode = require('postcode');
const messages = require('../lib/messages');

function validateSearch(search) {
  let errorMessage = null;
  let searchToReturn = search;

  if (!search) {
    errorMessage = messages.emptySearchMessage();
  } else {
    searchToReturn = search.trim();
    // const postcode = new Postcode(searchToReturn);
    //
    // if (postcode.valid()) {
    //   searchToReturn = postcode.normalise();
    // } else if (Postcode.validOutcode(searchToReturn)) {
    //   searchToReturn = searchToReturn.toLocaleUpperCase();
    // } else {
    //   errorMessage = messages.invalidPostcodeMessage(searchToReturn);
    // }
  }

  return {
    errorMessage,
    input: searchToReturn,
  };
}

module.exports = validateSearch;
