const util = require('util');
const chai = require('chai');
const esQueryBuilder = require('../../../app/lib/esQueryBuilder');

const expect = chai.expect;

function findKeyValuePair(obj, searchKey, searchValue) {
  return Object.keys(obj).some((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      if (findKeyValuePair(value, searchKey, searchValue)) {
        return true;
      }
    }

    if (key === searchKey && value === searchValue) {
      return true;
    }

    return false;
  });
}

describe('esQueryBuilder', () => {
  it('should return an object', () => {
    const query = esQueryBuilder.build();

    expect(query).to.be.an('object');
  });

  it('should populate the query with the search term', () => {
    const searchTerm = 'search for this';
    const query = esQueryBuilder.build(searchTerm);

    expect(findKeyValuePair(query, 'query', searchTerm))
      .to.be.equal(
        true,
        `"query: ${searchTerm}" not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should return the size as set in the locale', () => {
    const searchTerm = 'search for this';
    const res = { locals: { resultsReturnedCount: 30 } };
    const query = esQueryBuilder.build(searchTerm, res.locals.resultsReturnedCount);

    expect(query.body.size).to.be.equal(30);
  });
});
