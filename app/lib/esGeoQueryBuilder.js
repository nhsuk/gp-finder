function getShouldClause(searchTerm) {
  const shouldClause = [
    {
      match_phrase: {
        name: {
          query: searchTerm,
          boost: 2,
          slop: 1
        }
      }
    },
    {
      match_phrase: {
        alternativeName: {
          query: searchTerm,
          boost: 2,
          slop: 1
        }
      }
    },
    {
      common: {
        name: {
          query: searchTerm,
          cutoff_frequency: 0.0001
        }
      }
    },
    {
      common: {
        alternativeName: {
          query: searchTerm,
          cutoff_frequency: 0.0001
        }
      }
    },
    {
      nested: {
        path: 'doctors',
        query: {
          bool: {
            should: [
              {
                match_phrase: {
                  'doctors.name': {
                    query: searchTerm,
                    boost: 2,
                    slop: 1
                  }
                }
              },
              {
                match: {
                  'doctors.name': {
                    query: searchTerm
                  }
                }
              }
            ]
          }
        },
      }
    }
  ];

  return shouldClause;
}

function build(location, searchTerm) {
  const query = {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        bool: {
          filter: {
            geo_distance: {
              distance: '50mi',
              'location.coordinates': {
                lon: location.lon,
                lat: location.lat
              }
            }
          }
        }
      },
      sort: [
        {
          _geo_distance: {
            'location.coordinates': {
              lon: location.lon,
              lat: location.lat
            },
            order: 'asc',
            unit: 'mi',
            distance_type: 'plane'
          }
        }
      ]
    }
  };

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
