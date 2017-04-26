const chai = require('chai');
const gpDataMapper = require('../../../../app/lib/utils/gpDataMapper');

const expect = chai.expect;

describe('GP Surgery Data Mapper', () => {
  it('for a GP Surgery that has appointments POMI data and a url will return the url', () => {
    const gpData = { onlineServices: { appointments: { supplier: 'EMIS', url: 'http://example.com' } } };
    const expectedResult = 'http://example.com';
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a GP Surgery that has appointments POMI data but no url will return undefined', () => {
    const gpData = { onlineServices: { appointments: { supplier: 'EMIS (I)' } } };
    const expectedResult = undefined;
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a GP Surgery that has no appointments POMI data will return undefined', () => {
    const gpData = { onlineServices: { repeatPrescription: {} } };
    const expectedResult = undefined;
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a GP Surgery that has no online services  data will return undefined', () => {
    const gpData = {};
    const expectedResult = undefined;
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(expectedResult);
  });
});
