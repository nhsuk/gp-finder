const getShouldClause = require('./utils/getTextSearchShouldClause');
const getBaseQuery = require('./utils/getBaseQuery');

function build(searchTerm, size) {
  const query = getBaseQuery(size);
  query.body.query.bool.should = getShouldClause(searchTerm);
  return query;
}

module.exports = {
  build,
};
