const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.location = req.query.location;
  res.locals.context = req.query.context || '';
  res.locals.locationLabel = 'Enter a surgery name';

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
