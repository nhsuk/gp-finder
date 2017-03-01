const chai = require('chai');
const searchValidator = require('../../../app/lib/searchValidator');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Search validation', () => {
  describe('error handling', () => {
    it('should return an errorMessage when no search is provided', () => {
      const emptySearch = null;

      const result = searchValidator.validateSearch(emptySearch);

      expect(result.errorMessage)
        .to.be
        .equal(messages.emptySearchMessage());
    });

    it('should return an errorMessage when search is an empty string', () => {
      const emptySearch = '';

      const result = searchValidator.validateSearch(emptySearch);

      expect(result.errorMessage)
        .to.be
        .equal(messages.emptySearchMessage());
    });

    it('should return an errorMessage when search only has spaces', () => {
      const emptySearch = '   ';

      const result = searchValidator.validateSearch(emptySearch);

      expect(result.errorMessage)
        .to.be
        .equal(messages.emptySearchMessage());
    });

    it('should return an object with expected properties', () => {
      const emptySearch = '';

      const result = searchValidator.validateSearch(emptySearch);

      expect(result).to.be.an('object');
      expect(result).to.have.property('input');
      expect(result).to.have.property('errorMessage');
    });
  });

  describe('happy path', () => {
    describe('for some search term', () => {
      it('should return the input', () => {
        const someSearch = 'ab';
        const result = searchValidator.validateSearch(someSearch);

        expect(result.input).to.be.equal(someSearch);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });

      it('should return the trimmed input', () => {
        const someSearch = ' ab ';
        const trimmedSearch = 'ab';
        const result = searchValidator.validateSearch(someSearch);

        expect(result.input).to.be.equal(trimmedSearch);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });
    });
  });
});
