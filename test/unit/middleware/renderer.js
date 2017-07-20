const chai = require('chai');
const renderer = require('../../../app/middleware/renderer');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Postcode validation', () => {
  describe('error handling for handlePostcodeError', () => {
    it('should return an error message when an error exists', () => {
      const error = 'Some error';
      const postcode = 'S3';
      const res = {};
      res.locals = {};
      res.locals.errorMessage = null;
      const next = () => {};

      renderer.postcodeError(error, postcode, res, next);

      expect(res.locals.errorMessage).to.be.equal(messages.technicalProblems());
    });
  });

  describe('error handling for renderPostcodeNotEnglish', () => {
    it('should set a not England flag in the results', () => {
      const postcode = 'EH1';
      const search = '';
      const req = {};
      const res = {};
      res.locals = {};
      res.locals.outOfEnglandMessage = null;
      res.locals.isOutcode = true;
      res.render = () => {};

      renderer.postcodeNotEnglish(postcode, req, res);

      expect(res.locals.outOfEnglandMessage)
        .to.be.equal(messages.outOfEngland({ isOutcode: true, term: postcode }, search));
    });
  });

  describe('error handling for renderInvalidPostcodePage', () => {
    it('should return an error message when the postcode is invalid', () => {
      const postcode = 'S50 3EW';
      const req = {};
      const res = {};
      res.locals = {};
      res.locals.errorMessage = null;
      res.render = () => {};

      renderer.invalidPostcodePage(postcode, req, res);

      expect(res.locals.errorMessage).to.be.equal(messages.invalidPostcode());
    });
  });
});
