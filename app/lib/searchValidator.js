const messages = require('../lib/messages');

function checkForEmptySearch(searchTermName, searchTermPostcode) {
  let errorMessage = null;
  let searchToReturn = searchTermName;

  if (!(searchTermName) && !(searchTermPostcode)) {
    errorMessage = messages.emptySearchMessage();
  } else if (searchTermPostcode) {
    // TODO: If postcode, ignore the name search - this will be changed soon
    searchToReturn = searchTermPostcode;
  } else {
    searchToReturn = searchTermName;
  }

  return {
    errorMessage,
    input: searchToReturn,
  };
}

module.exports = {
  checkForEmptySearch,
};
