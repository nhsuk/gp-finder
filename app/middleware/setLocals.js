const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.search = req.query.search;
  res.locals.searchLabel = 'Enter your GP surgery’s name';

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
