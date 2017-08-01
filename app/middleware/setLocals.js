const backLinkUtils = require('../lib/utils/backLink');

function fromRequest(req, res, next) {
  res.locals.search = req.query.search;
  res.locals.postcodeSearch = req.query.postcode;
  res.locals.isOutcode = false;
  res.locals.searchLabel = 'Surgery or GP name';
  res.locals.searchButton = 'Search';

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
