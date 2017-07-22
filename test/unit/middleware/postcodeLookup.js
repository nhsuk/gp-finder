const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
// eslint-disable-next-line camelcase
const postcodeSampleResponse_HG50JL = require('./samples/postcodeResponse_HG50JL');
// eslint-disable-next-line camelcase
const outcodeSampleResponse_HG5 = require('./samples/outcodeResponse_HG5');
// eslint-disable-next-line camelcase
const outcodeSampleResponseCrossBorder_TD9 = require('./samples/outcodeResponseCrossBorder_TD9');

const expect = chai.expect;

function getPostcodeLookup(err, postcodeDetails, rendererMock) {
  const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
  const postcodesIOClientFake = {
    lookup: (postcode, callback) => {
      callback(err, postcodeDetails);
    }
  };
  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);

  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('renderer', rendererMock);

  return postcodeLookup;
}

function getSpyWithExpectations(expectations) {
  return sinon.spy(expectations);
}

describe('Postcode lookup', () => {
  it('should render an error page for postcode search when postcode.io is not available', () => {
    const postcodeErrorSpy = getSpyWithExpectations();
    const rendererMock = {
      postcodeError: postcodeErrorSpy
    };

    const postcodeLookup = getPostcodeLookup('Error!', null, rendererMock);

    postcodeLookup({}, { locals: { postcode: 'HG5 0JL' } }, () => {});

    expect(postcodeErrorSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeError renderer once');
    expect(postcodeErrorSpy.calledWith('Error!'))
      .to
      .equal(true, 'Should have passed error to renderer');
  });

  it('should render an invalid postcode page when postcode io thinks it is not a postcode', () => {
    const postcodeNotValidSpy = getSpyWithExpectations();
    const rendererMock = {
      invalidPostcodePage: postcodeNotValidSpy
    };
    const postcodeLookup = getPostcodeLookup(null, null, rendererMock);

    postcodeLookup({}, { locals: { postcode: 'blah' } }, () => {});

    expect(postcodeNotValidSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotValid renderer once');
    expect(postcodeNotValidSpy.calledWith('blah'))
      .to
      .equal(true, 'Should have passed invalid postcode to renderer');
  });

  describe('should set locals', () => {
    describe('country should always be mapped to an array', () => {
      // postcode.io returns country as a string for postcodes and array for outcodes
      it('postcode string country should be mapped to array', () => {
        const res = { locals: { postcode: 'HG5 0JL' } };
        const postcodeLookup = getPostcodeLookup(null, postcodeSampleResponse_HG50JL);

        const localsExpectations = () => {
          expect(Array.isArray(res.locals.postcodeLocationDetails.country)).to.equal(true);
          expect(res.locals.postcodeLocationDetails.country.length).to.equal(1);
          expect(res.locals.postcodeLocationDetails.country[0]).to.equal('England');
        };

        const nextSpy = getSpyWithExpectations(localsExpectations);

        postcodeLookup({}, res, nextSpy);

        expect(nextSpy.calledOnce)
          .to
          .equal(true, 'Should have called next once');
      });

      it('outcode string array of countries should be preserved as array', () => {
        // postcode.io returns country as a string for postcodes and array for outcodes
        const res = { locals: { postcode: 'TD9' } };
        const postcodeLookup = getPostcodeLookup(null, outcodeSampleResponseCrossBorder_TD9);
        const localsExpectations = () => {
          expect(Array.isArray(res.locals.postcodeLocationDetails.country)).to.equal(true);
          expect(res.locals.postcodeLocationDetails.country.length).to.equal(2);
          expect(res.locals.postcodeLocationDetails.country[0]).to.equal('England');
          expect(res.locals.postcodeLocationDetails.country[1]).to.equal('Scotland');
        };
        const nextSpy = getSpyWithExpectations(localsExpectations);

        postcodeLookup({}, res, nextSpy);

        expect(nextSpy.calledOnce)
          .to
          .equal(true, 'Should have called next once');
      });
    });

    it('outcode flag should be false if postcode in details', () => {
      const res = { locals: { postcode: 'HG5 0JL' } };
      const postcodeLookup = getPostcodeLookup(null, postcodeSampleResponse_HG50JL);

      const localsExpectations = () => {
        expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(false);
      };

      const nextSpy = getSpyWithExpectations(localsExpectations);

      postcodeLookup({}, res, nextSpy);

      expect(nextSpy.calledOnce).to.equal(true, 'Should have called next once');
    });

    it('outcode flag should be true if no postcode in details', () => {
      const res = { locals: { postcode: 'HG5' } };
      const postcodeLookup = getPostcodeLookup(null, outcodeSampleResponse_HG5);

      const localsExpectations = () => {
        expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(true);
      };

      const nextSpy = getSpyWithExpectations(localsExpectations);

      postcodeLookup({}, res, nextSpy);

      expect(nextSpy.calledOnce)
        .to
        .equal(true, 'Should have called next once');
    });

    it('coordinates should be set for postcode', () => {
      const postcodeLookup = getPostcodeLookup(null, outcodeSampleResponseCrossBorder_TD9);

      const res = {
        locals: {
          postcode: 'HG5'
        }
      };

      const expectations = () => {
        expect(res.locals.location.lat).to.equal(55.3977217554393);
        expect(res.locals.location.lon).to.equal(-2.77657929395506);
      };

      const nextSpy = getSpyWithExpectations(expectations);

      postcodeLookup({}, res, nextSpy);

      expect(nextSpy.calledOnce).to.equal(true, 'Should have called next once');
    });
  });

  it('should not pass postcode location details to next when the postcode is empty', () => {
    const postcodeLookup = getPostcodeLookup();

    const res = { locals: { postcode: '' } };

    const expectations = () => {
      expect(res.locals.postcodeLocationDetails).to.equal(undefined);
    };

    const nextSpy = getSpyWithExpectations(expectations);

    postcodeLookup({}, res, nextSpy);

    expect(nextSpy.calledOnce).to.equal(true, 'Should have called next once');
  });
});
