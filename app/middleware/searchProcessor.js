function stripWhitespace(req, res, next) {
  if (res.locals.search) {
    // eslint-disable-next-line no-param-reassign
    res.locals.search = res.locals.search.trim();
  }
  if (res.locals.postcode) {
    // eslint-disable-next-line no-param-reassign
    res.locals.postcode = res.locals.postcode.trim();
  }
  next();
}

module.exports = stripWhitespace;
