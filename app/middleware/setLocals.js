const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.search = req.query.search;
  res.locals.searchLabel = "Enter all or part of your GP surgery's name to see your booking options.";
  res.locals.searchButton = 'Search';

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
