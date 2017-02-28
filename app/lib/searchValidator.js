const messages = require('../lib/messages');

function validateSearch(search) {
  let errorMessage = null;
  let searchToReturn = search;

  if ((!search) || ((search) && (search.trim() === ''))) {
    errorMessage = messages.emptySearchMessage();
  } else {
    searchToReturn = search.trim();
  }

  return {
    errorMessage,
    input: searchToReturn,
  };
}

module.exports = validateSearch;
