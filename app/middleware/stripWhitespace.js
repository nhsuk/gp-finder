function stripWhitespace(req, res, next) {
  if (res.locals.search) {
    // eslint-disable-next-line no-param-reassign
    res.locals.search = res.locals.search.trim();
  }
  if (res.locals.postcodeSearch) {
    // eslint-disable-next-line no-param-reassign
    res.locals.postcodeSearch = res.locals.postcodeSearch.trim();
  }
  next();
}

module.exports = stripWhitespace;
