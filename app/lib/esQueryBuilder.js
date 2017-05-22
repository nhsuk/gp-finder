function build(searchTerm) {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        bool: {
          must: {
            multi_match: {
              query: searchTerm,
              fields: ['name^2', 'address.addressLines', 'doctors'],
              operator: 'or'
            }
          },
          should: [
            { match_phrase: {
              name: {
                query: searchTerm,
                boost: 2
              }
            } },
            { match_phrase: { doctors: searchTerm } },
            { match_phrase: { 'address.addressLines': searchTerm } }
          ]
        }
      }
    }
  };
}

module.exports = {
  build,
};
