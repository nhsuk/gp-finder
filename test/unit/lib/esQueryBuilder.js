const chai = require('chai');
const esQueryBuilder = require('../../../app/lib/esQueryBuilder');

const expect = chai.expect;

describe('esQueryBuilder', () => {
  it('should return an object', () => {
    const query = esQueryBuilder.build();

    expect(query).to.be.an('object');
  });

  it('should return the search term as q param', () => {
    const searchTerm = 'search for this';
    const query = esQueryBuilder.build(searchTerm);

    expect(query.q).to.be.equal(searchTerm);
  });

  it('should return the size as 30', () => {
    const query = esQueryBuilder.build();

    expect(query.size).to.be.equal(30);
  });
});
