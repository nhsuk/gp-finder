const excludedRegEx = /^(JE|GY|IM|BT)\d+/i;

function isNotEnglishPostcode(postcode) {
  return postcode !== undefined && postcode.match(excludedRegEx) !== null;
}

module.exports = isNotEnglishPostcode;
