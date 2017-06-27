const backLinkUtils = require('../lib/utils/backLink');

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.search = req.query.search;
  res.locals.postcode = req.query.postcode;
  res.locals.processedSearch = '';
  res.locals.searchLabel = 'Surgery or GP name';
  res.locals.searchButton = 'Next';

  const backLink = backLinkUtils(req, res);

  res.locals.backLink = {
    href: backLink.url,
    text: backLink.text,
  };
  /* eslint-enable no-param-reassign */
  next();
}

module.exports = {
  fromRequest,
};
