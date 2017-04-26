const chai = require('chai');
const gpDataMapper = require('../../../../app/lib/utils/gpDataMapper');

const expect = chai.expect;

describe('GP Surgery Data Mapper', () => {
<<<<<<< HEAD
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
=======
  describe('booking url', () => {
    it('for a GP Surgery that has POMI data and a url will return the url', () => {
      const gpData = { bookingSystem: { supplier: 'EMIS', bookOnlineLink: 'http://example.com' } };
      const expectedResult = 'http://example.com';
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal(expectedResult);
    });

    it('for a GP Surgery that has POMI data but no url will return undefined', () => {
      const gpData = { bookingSystem: { supplier: 'EMIS (I)' } };
      const expectedResult = undefined;
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal(expectedResult);
    });

    it('for a GP Surgery that has no POMI data will return undefined', () => {
      const gpData = {};
      const expectedResult = undefined;
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal(expectedResult);
    });
  });

  // Array comparison: https://medium.com/@victorleungtw/testing-with-mocha-array-comparison-e9a45b57df27
  describe('filteted doctors', () => {
    it('for a GP Surgery that has no doctors with the name matching the search will not return any doctors', () => {
      const gpData = { doctors: ['Dr. Farooq', 'Dr. Carter'] };
      const searchStr = 'Roberts';
      const expectedResult = [];
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(expectedResult);
    });

    it('for a GP Surgery that has no doctors  will not return any doctors', () => {
      const gpData = {};
      const searchStr = 'Roberts';
      const expectedResult = undefined;
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(expectedResult);
    });

    it('for a GP Surgery that has doctors with the name matching the search will return those doctors', () => {
      const gpData = { doctors: ['Dr. A Farooq', 'Dr. Carter', 'Dr. B Farooq'] };
      const searchStr = 'Farooq';
      const expectedResult = ['Dr. A Farooq', 'Dr. B Farooq'];
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(expectedResult);
    });
>>>>>>> 25a6678... :scissors: only return searched for doctors
  });
});
