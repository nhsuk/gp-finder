const chai = require('chai');
const postcodeValidator = require('../../../app/lib/postcodeValidator');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Postcode validation', () => {
  describe('error handling for handlePostcodeError', () => {
    xit('should return an errorMessage when an error exists', () => {
      const error = 'Some error';
      const postcode = 'S3';
      const res = { errorMessage: null };
      const next = {};

      postcodeValidator.handlePostcodeError(error, postcode, res, next);

      expect(res.errorMessage)
        .to.be
        .equal(messages.technicalProblems());
    });
  });
  describe('error handling for renderPostcodeNotEnglish', () => {
    xit('should set a not England flag in the results', () => {
      const res = { locals: { nonEngland: null } };
      const req = {};

      postcodeValidator.renderPostcodeNotEnglish(req, res);

      expect(res.locals.nonEngland)
        .to.be
        .equal(true);
    });
  });

  describe('error handling for renderInvalidPostcodePage', () => {
    xit('should return an errorMessage when the postcode is invalid', () => {
      const postcode = 'S50 3EW';
      const res = { errorMessage: null };
      const req = {};

      postcodeValidator.renderInvalidPostcodePage(postcode, req, res);

      expect(res.errorMessage)
        .to.be
        .equal(messages.invalidPostcodeMessage(postcode));
    });
  });
});
