const getShouldClause = require('./utils/getTextSearchShouldClause');
const getBaseQuery = require('./utils/getBaseQuery');

function build(searchTerm) {
  const query = getBaseQuery();
  query.body.query.bool.should = getShouldClause(searchTerm);
  return query;
}

module.exports = {
  build,
};
