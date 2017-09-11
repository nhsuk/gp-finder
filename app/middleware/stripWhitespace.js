function stripWhitespace(req, res, next) {
  if (res.locals.search) {
    res.locals.search = res.locals.search.trim();
  }
  if (res.locals.postcodeSearch) {
    res.locals.postcodeSearch = res.locals.postcodeSearch.trim();
  }
  next();
}

module.exports = stripWhitespace;
