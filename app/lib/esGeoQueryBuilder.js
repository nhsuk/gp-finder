const getShouldClause = require('./utils/getTextSearchShouldClause');
const getBaseQuery = require('./utils/getBaseQuery');

function build(location, searchTerm, size) {
  const query = getBaseQuery(size);

  query.body.query.bool.filter = {
    geo_distance: {
      distance: '50mi',
      'location.coordinates': {
        lat: location.lat,
        lon: location.lon,
      },
    },
  };

  query.body.sort = [
    {
      _geo_distance: {
        distance_type: 'plane',
        'location.coordinates': {
          lat: location.lat,
          lon: location.lon,
        },
        order: 'asc',
        unit: 'mi',
      },
    },
  ];

  if (searchTerm) {
    query.body.query.bool.should = getShouldClause(searchTerm);
    query.body.query.bool.minimum_should_match = 1;
  } else {
    query.body.query.bool.must = { match_all: {} };
  }

  return query;
}

module.exports = {
  build,
};
