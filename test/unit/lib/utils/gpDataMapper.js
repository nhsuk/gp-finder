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
  describe('filtered doctors', () => {
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
      const gpData = { doctors: [
        { name: 'Dr. A Farooq'},
        { name:'Dr. Carter'},
        { name: 'Dr. B Farooq'}
      ] };
      const searchStr = 'Farooq';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(['Dr. A Farooq', 'Dr. B Farooq']);
    });

    it('for a GP Surgery that has doctors with some of the name matching the search will return those doctors', () => {
      const gpData = { doctors: [
        { name: 'Dr. Elizabeth Beech'},
        { name: 'Dr. Elizabeth Ash'},
        { name: 'Dr. Elizabeth'},
        { name: 'Dr. B Beech'}
      ] };
      const searchStr = 'Elizabeth Beech';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(['Dr. Elizabeth Beech', 'Dr. Elizabeth Ash', 'Dr. Elizabeth', 'Dr. B Beech']);
    });

    it('for a GP Surgery that has Dr/Dr. in the title but not related to the search it should be ignored', () => {
      const gpData = { doctors: [
        { name: 'Dr. Elizabeth Beech'},
        { name: 'Dr. Elizabeth Ash'},
        { name: 'Dr. Elizabeth'},
        { name: 'Dr. B Beech'}
      ] };
      const searchStr = 'Dr Beech';
      const result = gpDataMapper.getFilteredGps(gpData, searchStr);

      expect(result).to.be.eql(['Dr. Elizabeth Beech', 'Dr. B Beech']);
    });
  });

  describe('mapped title for doctors', () => {
    it('for doctors that have variations of Doctor/Other/M* in their title should be changed to Dr', () => {
      const doctors = [
        'Doctor Elizabeth Beech',
        'Other Elizabeth Ash',
        'Mrs Elizabeth',
        'Dr. B Beech',
        'Dr. Beech'
      ] ;
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Dr Elizabeth Beech', 'Dr Elizabeth Ash', 'Dr Elizabeth', 'Dr B Beech', 'Dr Beech']);
    });

    it('for doctors that have variations of Prof/Proffessor in their title should be changed to Professor and have a GP at the end', () => {
      const doctors = [
        'Prof Elizabeth Beech',
        'Proffessor Elizabeth Ash',
        'Prof. Elizabeth',
        'Pro. B Beech'
      ] ;
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Professor Elizabeth Beech (GP)', 'Professor Elizabeth Ash (GP)', 'Professor Elizabeth (GP)', 'Professor B Beech (GP)']);
    });

    it('for doctors that have variations of drs in their title should be changed to Drs', () => {
      const doctors = [
        'drs Smith',
        'DRS Smith'
      ] ;
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Drs Smith', 'Drs Smith']);
    });

    it('for doctors that have variations of General Practitioner|Medi-Access Surgery in their title should be removed', () => {
      const doctors = [
        'General Practitioner Dr Smith',
        'Medi-Access Surgery Dr Smith'
      ];
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Dr Smith', 'Dr Smith']);
    });

    it('for doctors that have variations of Locum/The in their title should be ignored', () => {
      const doctors = [
        'Locum Smith',
        'The Greatest'
      ];
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Locum Smith', 'The Greatest']);
    });

    it('for doctors that have nothing in their title should be changed to Dr', () => {
      const doctors = [
        'Smith',
        'A Farooq'
      ];
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Dr Smith', 'Dr A Farooq']);
    });
    it('for doctors that have ./space in their title should be changed to Dr', () => {
      const doctors = [
        ' Smith',
        '.A Farooq'
      ];
      const result = gpDataMapper.mappedTitleForGps(doctors);

      expect(result).to.be.eql(['Dr Smith', 'Dr A Farooq']);
    });
  });
});
