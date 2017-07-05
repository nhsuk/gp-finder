const messages = require('../lib/messages');

function preRender(req, res, next) {
  const postcode =
   (res.locals.postcode) ?
     { isOutcode: res.locals.isOutcode, term: res.locals.postcode }
     : undefined;

  res.locals.noResultsMessage =
    messages.noResultsMessage(res, res.locals.gps.length === 0, postcode, res.locals.search);
  res.locals.searchInformationMessage =
    messages.searchInfomationMessage(res.locals.gps.length === 1, postcode, res.locals.search);
  res.locals.searchHelpMessage =
    messages.searchHelpMessage(postcode, res.locals.search !== '');

  next();
}

module.exports = preRender;
