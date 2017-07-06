const chai = require('chai');
const rewire = require('rewire');

const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
const expect = chai.expect;

describe('Postcode lookup', () => {
  describe('error handling in postcode.io', () => {
    it('should render an error page when postcode.io is not available', () => {
      const postcodesIOClientFake = {
        outcode: (postcode, callback) => { callback('Boom!', null); }
      };

      let postcodeErrorCalled = false;

      const rendererMock = {
        postcodeError: (err) => {
          expect(err).to.equal('Boom!');
          postcodeErrorCalled = true;
        }
      };

      // eslint-disable-next-line no-underscore-dangle
      postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);
      // eslint-disable-next-line no-underscore-dangle
      postcodeLookup.__set__('renderer', rendererMock);

      postcodeLookup({}, { locals: { postcode: 'HG5' } }, () => {});

      expect(postcodeErrorCalled).to.equal(true);
    });
  });
});
