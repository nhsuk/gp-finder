const chai = require('chai');
const esQueryBuilder = require('../../../app/lib/esQueryBuilder');

const expect = chai.expect;

describe('esQueryBuilder', () => {
  it('should return an object', () => {
    const query = esQueryBuilder.build();

    expect(query).to.be.an('object');
  });

  it('should return the size as 30', () => {
    const query = esQueryBuilder.build();

    expect(query.body.size).to.be.equal(30);
  });
});
