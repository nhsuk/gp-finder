function emptySearchMessage() {
  return 'Enter the name of your surgery, the name of your GP or a postcode.';
}

function invalidPostcodeMessage() {
  return 'Check you\'re using the right postcode. Or search using the name of your GP or surgery.';
}

function notEnglishPostcodeMessage() {
  return 'If you\'re not in England, ask your GP\'s receptionist or visit the surgery website to find out if you can ' +
    'book an appointment online. If you\'ve used the wrong postcode, you can search again.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  emptySearchMessage,
  invalidPostcodeMessage,
  notEnglishPostcodeMessage,
  technicalProblems,
};
