const searchForm = require('../../../public/src/search-form');
const chai = require('chai');

const expect = chai.expect;

describe('search-form', () => {
  describe('whitespace', () => {
    xit('should strip the ', () => {
      const text = 'This has white space';

      expect(searchForm.removeWhitespace(text)).to.equal('Thishaswhitespace');
    });
  });
});
