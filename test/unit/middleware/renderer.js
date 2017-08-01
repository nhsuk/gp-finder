const chai = require('chai');
const renderer = require('../../../app/middleware/renderer');
const spyUtils = require('../../lib/spy-utils');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;
const getSpy = spyUtils.getSpy;
const expectCalledOnce = spyUtils.expectCalledOnce;

describe('Postcode validation', () => {
  describe('error handling for handlePostcodeError', () => {
    it('should set error message to technical error when an error is passed', () => {
      const postcode = 'S3';
      const res = {
        locals: {
          postcodeLocationDetails: { isOutcode: true }
        }
      };

      const localsExpectations = (error) => {
        expect(error).to.equal('Some error');
        // eslint-disable-next-line no-unused-expressions
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage).to.equal(messages.technicalProblems());
      };

      const nextSpy = getSpy('next', localsExpectations);

      renderer.postcodeError('Some error', postcode, res, nextSpy);

      expectCalledOnce(nextSpy);
    });
  });

  describe('error handling for postcodeError', () => {
    it('should set a not England flag in the results', () => {
      const postcode = 'EH1';
      const search = '';
      const req = {
        query: {
          postcode: 'EH1',
          isOutcode: 'true'
        }
      };
      const res = {
        locals: {
          postcodeLocationDetails: { isOutcode: true }
        }
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('outside-england');
        expect(res.locals.outOfEnglandMessage)
          .to.equal(messages.outOfEngland({ isOutcode: true, term: postcode }, search));
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.postcodeNotEnglish(req, res);

      expectCalledOnce(res.render);
    });
  });

  describe('results', () => {
    const req = {};
    it('should render results page when there are GPs', () => {
      const res = {
        locals: {
          gps: [
            'The Surgery'
          ]
        }
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('results');
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.results(req, res);

      expectCalledOnce(res.render);
    });

    it('should render no results page when there are no GPs', () => {
      const res = {
        locals: {
          gps: []
        }
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('no-results');
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.results(req, res);

      expectCalledOnce(res.render);
    });
  });

  describe('error handling for renderInvalidPostcodePage', () => {
    it('should return an error message when the postcode is invalid', () => {
      const postcode = 'S50 3EW';
      const req = {};

      const res = {
        locals: {}
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('search-for-your-gp');
        // eslint-disable-next-line no-unused-expressions
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage).to.equal(messages.invalidPostcode());
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.invalidPostcodePage(postcode, req, res);

      expectCalledOnce(res.render);
    });
  });
});
