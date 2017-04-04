const chai = require('chai');
const gpDataMapper = require('../../../../app/lib/utils/gpDataMapper');

const expect = chai.expect;

describe('GP Surgery Data Mapper', () => {
  it('for a GP Surgery that has POMI data and a url will return the url', () => {
    const gpData = { bookingSystem: { supplier: 'EMIS', bookOnlineLink: 'http://example.com' } };
    const expectedResult = 'http://example.com';
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a GP Surgery that has POMI data but no url will return undefined', () => {
    const gpData = { bookingSystem: { supplier: 'EMIS (I)' } };
    const expectedResult = undefined;
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a GP Surgery that has no POMI data will return undefined', () => {
    const gpData = {};
    const expectedResult = undefined;
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });
});
