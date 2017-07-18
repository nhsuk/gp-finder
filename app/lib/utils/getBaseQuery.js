function getBaseQuery() {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        bool: {}
      }
    }
  };
}

module.exports = getBaseQuery;
