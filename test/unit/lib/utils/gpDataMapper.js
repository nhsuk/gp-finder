const chai = require('chai');
const gpDataMapper = require('../../../../app/lib/utils/gpDataMapper');

const expect = chai.expect;

describe('GP Surgery Data Mapper', () => {
  it('for a GP Surgery that has appointments POMI data and a url will return the url', () => {
    const gpData = { onlineServices: { appointments: { supplier: 'EMIS', url: 'http://example.com' } } };
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal('http://example.com');
  });

  it('for a GP Surgery that has no appointments POMI data will return undefined', () => {
    const gpData = { onlineServices: { repeatPrescription: {} } };
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(undefined);
  });

  it('for a GP Surgery that has no online services  data will return undefined', () => {
    const gpData = {};
    const result = gpDataMapper(gpData);

    expect(result).to.be.equal(undefined);
  });
});
