function searchHelpMessage(hasPostcode, hasSearchTerm) {
  const searchAgainLink = '<a href=\'/book-a-gp-appointment\'>search again</a>';
  let helpPrompt = 'If your surgery is not here, ';
  if (hasPostcode) {
    helpPrompt += 'check the postcode ';
    if (hasSearchTerm) {
      helpPrompt += `and text you have entered are right and ${searchAgainLink}.`;
    } else {
      helpPrompt += `you have entered is right and ${searchAgainLink}. You can also search by the name of your GP or surgery.`;
    }
  } else {
    helpPrompt += `check the text you have entered is right and ${searchAgainLink}. You can also search by your postcode.`;
  }

  return helpPrompt;
}

function searchInfomationMessage(singleResult, searchPostcode, searchTerm) {
  let returnValue = `We found ${(singleResult) ? 'this surgery' : 'these surgeries'}`;
  if (searchPostcode) {
    if (searchPostcode.isOutcode) {
      returnValue += ` close to the '${searchPostcode.term}' area`;
    } else {
      returnValue += ` near to '${searchPostcode.term}'`;
    }
  }

  if (searchTerm) {
    returnValue += `${(searchPostcode) ? ' and' : ''} using '${searchTerm}'`;
  }

  return `${returnValue}.`;
}

function emptySearchMessage() {
  return 'Enter the name of your surgery, the name of your GP or a postcode.';
}

function invalidPostcodeMessage() {
  return 'Check you\'re using the right postcode. Or search using the name of your GP or surgery.';
}

function notEnglishPostcodeMessage() {
  return 'This service is for GP surgeries in England. If your GP is not in England, go to their website or contact ' +
    'reception to find out if you can book an appointment online. If you\'ve used the wrong postcode, you can search again.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  searchInfomationMessage,
  searchHelpMessage,
  emptySearchMessage,
  invalidPostcodeMessage,
  notEnglishPostcodeMessage,
  technicalProblems,
};
