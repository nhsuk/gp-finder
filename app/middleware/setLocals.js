const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.search = req.query.search;
  res.locals.searchLabel = "Enter part or all of your surgery's name.";
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
