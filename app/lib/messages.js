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

function noResultsMessage(searchPostcode, searchTerm) {
  const headerPrompt = `We can not find a surgery${promptBuilder(searchPostcode, searchTerm)}`;
  let paragraphPrompt = '';
  let errorClass = '';
  if ((searchPostcode) && (searchTerm)) {
    paragraphPrompt = 'Check the name and the postcode you entered are right. You get better results if you enter ' +
      'a full name or postcode.';
    errorClass = 'blank';
  } else if (searchTerm) { // NOTE: there are no postcode only errors
    errorClass = 'search';
    paragraphPrompt = 'Check the name you entered is right. You get better results if you enter a full name. ' +
      'You can also search using a postcode.';
  }
  return { header: headerPrompt, paragraph: paragraphPrompt, class: errorClass };
}

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
  searchInfomationMessage,
  searchHelpMessage,
  noResultsMessage,
  emptySearchMessage,
  invalidPostcodeMessage,
  technicalProblems,
};
