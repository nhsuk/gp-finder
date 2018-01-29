const backLinkUtils = require('../lib/utils/backLink');
const parseSearch = require('../lib/utils/parseSearch');

function fromRequest(req, res, next) {
  if (req.query.search) {
    const searchTerms = parseSearch.getSearchTerms(req.query.search);
    res.locals.search = searchTerms.search;
    res.locals.postcodeSearch = searchTerms.postcode;
  }
  res.locals.resultsCount = 0;
  res.locals.isOutcode = false;
  res.locals.searchLabel = 'Surgery or GP name';
  res.locals.searchButton = 'Next';

  const backLink = backLinkUtils(req, res);

  res.locals.backLink = {
    href: backLink.url,
    text: backLink.text,
  };
  next();
}

module.exports = {
  fromRequest,
};
