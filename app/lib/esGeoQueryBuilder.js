function build(location) {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        bool: {
          must: {
            match_all: {}
          },
          filter: {
            geo_distance: {
              distance: '5km',
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
            unit: 'km',
            distance_type: 'plane'
          }
        }
      ]
    }
  };
}

module.exports = {
  build,
};
