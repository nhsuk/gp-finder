const messages = require('../lib/messages');

function isEmpty(search) {
  return !search || !search.trim();
}

function validateSearch(search) {
  let errorMessage = null;
  let searchToReturn = search;

  if (isEmpty(search)) {
    errorMessage = messages.emptySearchMessage();
  } else {
    searchToReturn = search.trim();
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
