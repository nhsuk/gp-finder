const PostcodesIO = require('postcodesio-client');

const postcodes = new PostcodesIO();

function lookupPostcode(req, res, next) {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/gi;
  const search = res.locals.search;

  if (search.match(postcodeRegex)) {
    postcodes.lookup(search, (err, postcode) => {
      // {
      //   "postcode": "EC1V 9LB",
      //   "admin_district": "Islington",
      //   "longitude": -0.091247681768113,
      //   "latitude": 51.5278436902703,
      //   "region": "London",
      //   ...
      // }
      res.locals.location = { lat: postcode.latitude, lon: postcode.longitude };
      next();
    });
  } else {
    next();
  }
}

module.exports = lookupPostcode;
