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
    }
  ];

  return shouldClause;
}

module.exports = getShouldClause;
