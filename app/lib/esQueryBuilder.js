function build(searchTerm) {
  return {
    index: 'profiles',
    type: 'gps',
    body: {
      size: 30,
      query: {
        bool: {
          should: [
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
                            query: searchTerm,
                            cutoff_frequency: 0.0001
                          }
                        }
                      }
                    ]
                  }
                },
              }
            }]
        }
      },

    }
  };
}

module.exports = {
  build,
};
