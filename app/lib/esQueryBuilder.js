function build(searchTerm) {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        multi_match: {
          query: searchTerm,
          fields: ['name^2', 'address.addressLines', 'doctors'],
          type: "cross_fields",
          operator: 'and'
        }
      }
    }
  };
}

module.exports = {
  build,
};
