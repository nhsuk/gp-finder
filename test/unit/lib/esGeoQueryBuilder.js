const util = require('util');
const chai = require('chai');
const esGeoQueryBuilder = require('../../../app/lib/esGeoQueryBuilder');

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

describe('esGeoQueryBuilder', () => {
  const location = {
    lat: 52.71283117402151,
    lon: -2.74961048457895
  };
  const searchTerm = 'search for this';
  it('should return an object', () => {
    const query = esGeoQueryBuilder.build(location, searchTerm);
    expect(query).to.be.an('object');
  });

  it('should populate the query with the search term', () => {
    const query = esGeoQueryBuilder.build(location, searchTerm);
    expect(findKeyValuePair(query, 'query', searchTerm))
      .to.be.equal(
        true,
        `"query: ${searchTerm}" not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should not populate the query with an empty search term', () => {
    const query = esGeoQueryBuilder.build(location, '');
    expect(query.body.query.bool.should).to.be.equal(
      undefined,
      `"should clause found in\n${util.inspect(query, { depth: null })}`
    );
  });

  it('should return the size as 30', () => {
    const query = esGeoQueryBuilder.build(location, searchTerm);
    expect(query.body.size).to.be.equal(30);
  });
});
