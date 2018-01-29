const Postcode = require('postcode');

function getSearchTerms(searchString) {
  const noSpacesSearchTerm = searchString.replace(/\s/g, '');
  const postcode = new Postcode(noSpacesSearchTerm);
  if (postcode.valid() || Postcode.validOutcode(noSpacesSearchTerm)) {
    return {
      postcode: noSpacesSearchTerm
    };
  }
  return {
    search: searchString
  };
}

module.exports = {
  getSearchTerms
};
