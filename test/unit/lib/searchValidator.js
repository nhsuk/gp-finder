const chai = require('chai');
const searchValidator = require('../../../app/lib/searchValidator');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Search validation', () => {
  describe('error handling', () => {
    it('should return an errorMessage when no name nor postcode is provided', () => {
      const emptyName = null;
      const emptyPostcode = null;

      const result = searchValidator.checkForEmptySearch(emptyName, emptyPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(messages.emptySearchMessage());
    });

    it('should return an errorMessage when name or postcode are empty strings', () => {
      const emptyName = '';
      const emptyPostcode = '';

      const result = searchValidator.checkForEmptySearch(emptyName, emptyPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(messages.emptySearchMessage());
    });

    it('should return an object with expected properties', () => {
      const emptyName = '';
      const emptyPostcode = '';

      const result = searchValidator.checkForEmptySearch(emptyName, emptyPostcode);

      expect(result).to.be.an('object');
      expect(result).to.have.property('input');
      expect(result).to.have.property('errorMessage');
    });
  });

  describe('happy path', () => {
    describe('for some name search term and no postcode', () => {
      it('should return the name search', () => {
        const someName = 'ab';
        const somePostcode = '';
        const result = searchValidator.checkForEmptySearch(someName, somePostcode);

        expect(result.input).to.be.equal(someName);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });
    });
    describe('for some name search term and some postcode', () => {
      it('should return the postcode search', () => {
        const someName = 'ab';
        const somePostcode = 'sn8';
        const result = searchValidator.checkForEmptySearch(someName, somePostcode);

        expect(result.input).to.be.equal(somePostcode);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });
    });
  });
});
