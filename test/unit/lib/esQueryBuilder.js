const util = require('util');
const chai = require('chai');
const esQueryBuilder = require('../../../app/lib/esQueryBuilder');

const expect = chai.expect;

function searchObj(obj, propertyName, query) {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      if (searchObj(value, propertyName, query)) {
        return true;
      }
    }

    if (key === propertyName && value === query) {
      return true;
    }

    return false;
  }).length > 0;
}

describe('esQueryBuilder', () => {
  it('should return an object', () => {
    const query = esQueryBuilder.build();

    expect(query).to.be.an('object');
  });

  it('should populate the query with the search term', () => {
    const searchTerm = 'search for this';
    const query = esQueryBuilder.build(searchTerm);

    expect(
      searchObj(query, 'query', searchTerm)
    )
    .to.be.equal(
      true,
      `"query: ${searchTerm}" not found in\n${util.inspect(query, { depth: null })}`
    );
  });

  it('should return the size as 30', () => {
    const query = esQueryBuilder.build();

    expect(query.body.size).to.be.equal(30);
  });
});
