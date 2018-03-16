function getBaseQuery(size) {
  return {
    body: {
      query: {
        bool: {},
      },
      size,
    },
    index: 'profiles',
    type: 'gps',
  };
}

module.exports = getBaseQuery;
