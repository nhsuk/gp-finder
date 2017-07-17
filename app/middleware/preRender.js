const messages = require('../lib/messages');

function preRender(req, res, next) {
  const postcode =
   (res.locals.postcode) ?
     { isOutcode: res.locals.isOutcode, term: res.locals.postcode }
     : undefined;

  res.locals.noResultsMessage =
    messages.noResults(postcode, res.locals.search);
  if (res.locals.noResultsMessage) {
    res.locals.searchErrorClass = res.locals.noResultsMessage.class;
  }
  res.locals.searchInformationMessage =
    messages.searchInformation(res.locals.gps.length === 1, postcode, res.locals.search);
  res.locals.searchHelpMessage =
    messages.searchHelp(postcode, res.locals.search !== '');

  next();
}

module.exports = preRender;
