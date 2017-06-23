function emptySearchMessage() {
  return 'Enter the name of your surgery, the name of your GP or a postcode.';
}

function invalidPostcodeMessage() {
  return 'Check you\'re using the right postcode. Or search using the name of your GP or surgery.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  emptySearchMessage,
  invalidPostcodeMessage,
  technicalProblems,
};
