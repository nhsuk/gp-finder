function getShouldClause(searchTerm) {
  const shouldClause = [
    {
      match_phrase: {
        name: {
          boost: 2,
          query: searchTerm,
          slop: 1,
        },
      },
    },
    {
      match_phrase: {
        alternativeName: {
          boost: 2,
          query: searchTerm,
          slop: 1,
        },
      },
    },
    {
      common: {
        name: {
          cutoff_frequency: 0.0001,
          query: searchTerm,
        },
      },
    },
    {
      common: {
        alternativeName: {
          cutoff_frequency: 0.0001,
          query: searchTerm,
        },
      },
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
                    boost: 2,
                    query: searchTerm,
                    slop: 1,
                  },
                },
              },
              {
                match: {
                  'doctors.name': {
                    query: searchTerm,
                  },
                },
              },
            ],
          },
        },
      },
    },
  ];

  return shouldClause;
}

module.exports = getShouldClause;
