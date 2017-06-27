// http://www.roblocher.com/technotes/uk-postareas.html
const excludedRegEx = /^(AB|BT|CF|DD|EH|FK|G|GY|HS|IM|IV|JE|KA|KW|KY|ML|PA|PH|SA|ZE)\d+/i;

function isNotEnglishPostcode(postcode) {
  return postcode !== undefined && postcode.match(excludedRegEx) !== null;
}

module.exports = isNotEnglishPostcode;
