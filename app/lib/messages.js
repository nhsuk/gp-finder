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
    helpPrompt += `check the text you have entered is right and ${searchAgainLink}. You can also search using a postcode.`;
  }

  return helpPrompt;
}

function promptBuilder(searchPostcode, searchTerm) {
  let returnValue = '';

  if (searchPostcode) {
    if (searchPostcode.isOutcode) {
      returnValue += ` close to the '${searchPostcode.term}' area`;
    } else {
      returnValue += ` near to '${searchPostcode.term}'`;
    }
  }

  if (searchTerm) {
    returnValue += ` using '${searchTerm}'`;
  }
  return returnValue;
}

function searchInfomationMessage(singleResult, searchPostcode, searchTerm) {
  return `We found ${(singleResult) ? 'this surgery' : 'these surgeries'}${promptBuilder(searchPostcode, searchTerm)}.`;
}

function noResultsMessage(res, searchPostcode, searchTerm) {
  const headerPrompt = `<h2>We can not find a surgery${promptBuilder(searchPostcode, searchTerm)}</h2>`;
  let paragraphPrompt = '';
  if ((searchPostcode) && (searchTerm)) {
    paragraphPrompt = '<p>Check the name and the postcode you entered are right. You get better results if you enter ' +
      'a full name or postcode.</p>';
    res.locals.searchErrorClass = 'blank';
  } else if (searchTerm) { // NOTE: there are no postcode only errors
    res.locals.searchErrorClass = 'search';
    paragraphPrompt = '<p>Check the name you entered is right. You get better results if you enter a full name. ' +
      'You can also search using a postcode.</p>';
  }
  return `${headerPrompt} ${paragraphPrompt}`;
}

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
  searchInfomationMessage,
  searchHelpMessage,
  noResultsMessage,
  emptySearchMessage,
  invalidPostcodeMessage,
  notEnglishPostcodeMessage,
  technicalProblems,
};
