function isOutcode(postcode) {
  const outcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/gi;
  return postcode.match(outcodeRegex);
}

function isPostcode(postcode) {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/gi;
  return postcode.match(postcodeRegex);
}

module.exports = {
  isOutcode,
  isPostcode
};
