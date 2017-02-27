function emptySearchMessage() {
  return "You didn't enter any text into the search box. You must type at least part of your GP surgery's name before searching.";
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  emptySearchMessage,
  technicalProblems,
};
