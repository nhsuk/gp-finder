function getBaseQuery(size) {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size,
      query: {
        bool: {}
      }
    }
  };
}

module.exports = getBaseQuery;
