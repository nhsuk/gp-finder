const searchAgainLink = '<a href=\'/book-a-gp-appointment\'>search again</a>';

function searchHelp(hasPostcode, hasSearchTerm) {
  let helpPrompt = 'If your surgery is not here, ';
  if (hasPostcode) {
    helpPrompt += 'check the postcode ';
    if (hasSearchTerm) {
      helpPrompt += `and text you have entered are right and ${searchAgainLink}.`;
    } else {
      helpPrompt += `you have entered is right and ${searchAgainLink}. You can also search by the name of your GP or surgery.`;
    }
  } else {
    helpPrompt += `check the text you have entered is right and ${searchAgainLink}.`;
  }

  return helpPrompt;
}

function postcodeProximityMessage(searchPostcode, searchTerm) {
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

function searchInformation(singleResult, searchPostcode, searchTerm) {
  return `We found ${(singleResult) ? 'this surgery' : 'these surgeries'}${postcodeProximityMessage(searchPostcode, searchTerm)}.`;
}

function noResults(searchPostcode, searchTerm) {
  const headerPrompt = `We can not find a surgery${postcodeProximityMessage(searchPostcode, searchTerm)}`;
  const errorClass = 'search';
  const paragraphPrompt = 'Check the name or postcode you entered is correct.';
  return { header: headerPrompt, paragraph: paragraphPrompt, class: errorClass };
}

function outOfEngland(searchPostcode) {
  let returnValue = '';

  if (searchPostcode) {
    if (searchPostcode.isOutcode) {
      returnValue = `The area '${searchPostcode.term}'`;
    } else {
      returnValue = `The postcode '${searchPostcode.term}'`;
    }
  }

  returnValue += ` is not in England. If you entered the wrong postcode, you can ${searchAgainLink}.`;

  return returnValue;
}

function emptySearch() {
  return 'what text should be here?';
}

function invalidPostcode() {
  return 'Check you\'re using the right postcode. Or search using the name of your GP or surgery.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  searchInformation,
  searchHelp,
  noResults,
  outOfEngland,
  emptySearch,
  invalidPostcode,
  technicalProblems,
};
