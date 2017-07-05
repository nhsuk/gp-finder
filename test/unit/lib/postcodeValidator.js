const chai = require('chai');
const postcodeValidator = require('../../../app/lib/postcodeValidator');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Postcode validation', () => {
  describe('error handling for handlePostcodeError', () => {
    it('should return an errorMessage when an error exists', () => {
      const error = 'Some error';
      const postcode = 'S3';
      const res = {};
      res.locals = {};
      res.locals.errorMessage = null;
      const next = () => {};

      postcodeValidator.handlePostcodeError(error, postcode, res, next);

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
      res.render = () => {};

      postcodeValidator.renderPostcodeNotEnglish(postcode, req, res);

      expect(res.locals.outOfEnglandMessage)
        .to.be.equal(messages.outOfEnglandMessage({ isOutcode: true, term: postcode }, search));
    });
  });

  describe('error handling for renderInvalidPostcodePage', () => {
    it('should return an errorMessage when the postcode is invalid', () => {
      const postcode = 'S50 3EW';
      const req = {};
      const res = {};
      res.locals = {};
      res.locals.errorMessage = null;
      res.render = () => {};

      postcodeValidator.renderInvalidPostcodePage(postcode, req, res);

      expect(res.locals.errorMessage).to.be.equal(messages.invalidPostcodeMessage());
    });
  });
});
