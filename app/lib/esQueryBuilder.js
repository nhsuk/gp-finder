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
              common: {
                name: {
                  query: searchTerm,
                  cutoff_frequency: 0.0001
                }
              }
            },
            {
              common: {
                name2: {
                  query: searchTerm,
                  cutoff_frequency: 0.0001
                }
              }
            },
            {
              nested: {
                path: 'doctors2',
                query: {
                  bool: {
                    should: [
                      {
                        match_phrase: {
                          'doctors2.name': {
                            query: searchTerm,
                            boost: 2,
                            slop: 1
                          }
                        }
                      },
                      {
                        match: {
                          'doctors2.name': {
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
