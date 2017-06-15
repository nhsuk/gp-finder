const messages = require('../lib/messages');

function isEmpty(search) {
  return !search || !search.trim();
}

function validateSearch(searchTermName, searchTermPostcode) {
  let errorMessage = null;
  let searchToReturn = searchTermName;

  if (isEmpty(searchTermName) && isEmpty(searchTermPostcode)) {
    errorMessage = messages.emptySearchMessage();
  } else if (!isEmpty(searchTermPostcode)) {
    // TODO: If postcode, ignore the name search - this will be changed soon
    searchToReturn = searchTermPostcode.trim();
  } else {
    searchToReturn = searchTermName.trim();
  }

  return {
    errorMessage,
    input: searchToReturn,
  };
}

module.exports = {
  isEmpty,
  validateSearch,
};
