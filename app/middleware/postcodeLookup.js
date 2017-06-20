const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function lookupPostcode(req, res, next) {
  const outcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/gi;
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/gi;
  const search = res.locals.processedSearch;

  if (search.match(outcodeRegex)) {
    postcodes.outcode(search, (err, postcode) => {
      res.locals.location = { lat: postcode.latitude, lon: postcode.longitude };
      next();
    });
  } else if (search.match(postcodeRegex)) {
    postcodes.lookup(search, (err, postcode) => {
      res.locals.location = { lat: postcode.latitude, lon: postcode.longitude };
      next();
    });
  } else {
    next();
  }
}

module.exports = lookupPostcode;