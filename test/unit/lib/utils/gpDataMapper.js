const chai = require('chai');
const gpDataMapper = require('../../../../app/lib/utils/gpDataMapper');

const expect = chai.expect;

describe('GP Surgery Data Mapper', () => {
  describe('booking url', () => {
    it('for a GP Surgery that has appointments POMI data and a url will return the url', () => {
      const gpData = { onlineServices: { appointments: { supplier: 'EMIS', url: 'http://example.com' } } };
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal('http://example.com');
    });

    it('for a GP Surgery that has no appointments POMI data will return undefined', () => {
      const gpData = { onlineServices: { repeatPrescription: {} } };
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal(undefined);
    });

    it('for a GP Surgery that has no online services  data will return undefined', () => {
      const gpData = {};
      const result = gpDataMapper.getBookOnlineLink(gpData);

      expect(result).to.be.equal(undefined);
    });
  });

  // Array comparison: https://medium.com/@victorleungtw/testing-with-mocha-array-comparison-e9a45b57df27
  describe('filteted doctors', () => {
    it('for a GP Surgery that has no doctors with the name matching the search will not return any doctors', () => {
      const gpData = { doctors: ['Dr. Farooq', 'Dr. Carter'] };
      const searchStr = 'Roberts';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql([]);
    });

    it('for a GP Surgery that has no doctors  will not return any doctors', () => {
      const gpData = {};
      const searchStr = 'Roberts';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(undefined);
    });

    it('for a GP Surgery that has doctors with the name matching the search will return those doctors', () => {
      const gpData = { doctors: ['Dr. A Farooq', 'Dr. Carter', 'Dr. B Farooq'] };
      const searchStr = 'Farooq';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(['Dr. A Farooq', 'Dr. B Farooq']);
    });

    it('for a GP Surgery that has doctors with the some of the name matching the search will return those doctors', () => {
      const gpData = { doctors: ['Dr. Elizabeth Beech', 'Dr. Elizabeth Ash', 'Dr. Elizabeth', 'Dr. B Beech'] };
      const searchStr = 'Elizabeth Beech';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(['Dr. Elizabeth Beech', 'Dr. Elizabeth Ash', 'Dr. Elizabeth', 'Dr. B Beech']);
    });
  });
});
