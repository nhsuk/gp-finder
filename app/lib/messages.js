function invalidSearchMessage(search) {
  return `We can't find the search ${search.toLocaleUpperCase()}. Check the search is correct and try again.`;
}

function emptySearchMessage() {
  return 'You must insert a search to find a surgery.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  invalidSearchMessage,
  emptySearchMessage,
  technicalProblems,
};
