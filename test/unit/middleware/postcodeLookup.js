const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const expect = chai.expect;

describe('Postcode lookup', () => {
  describe('error handling in postcode.io', () => {
    it('should render an error page for postcode search when postcode.io is not available', () => {
      const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
      const postcodesIOClientFake = {
        lookup: (postcode, callback) => { callback('Error!'); }
      };

      const postcodeErrorSpy = sinon.spy();
      const rendererMock = {
        postcodeError: postcodeErrorSpy
      };

      // eslint-disable-next-line no-underscore-dangle
      postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);
      // eslint-disable-next-line no-underscore-dangle
      postcodeLookup.__set__('renderer', rendererMock);

      postcodeLookup({}, { locals: { postcode: 'HG5 0JL' } }, () => {});

      expect(postcodeErrorSpy.calledOnce)
        .to
        .equal(true, 'Should have called postcodeError renderer once');
      expect(postcodeErrorSpy.calledWith('Error!'))
        .to
        .equal(true, 'Should have passed error to renderer');
    });
  });
});
