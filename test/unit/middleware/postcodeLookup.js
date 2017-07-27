const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const rewire = require('rewire');
const spyUtils = require('../../lib/spy-utils');
// eslint-disable-next-line camelcase
const postcodeSampleResponse_HG50JL = require('./samples/postcodeResponse_HG50JL');
// eslint-disable-next-line camelcase
const outcodeSampleResponse_HG5 = require('./samples/outcodeResponse_HG5');
// eslint-disable-next-line camelcase
const outcodeSampleResponseCrossBorder_TD9 = require('./samples/outcodeResponseCrossBorder_TD9');

const expect = chai.expect;
const getNextSpy = spyUtils.getNextSpy;
const getNextExpectations = spyUtils.getNextExpectations;
const expectCalledOnce = spyUtils.expectCalledOnce;

chai.use(chaiAsPromised);

// function getFakeLookup(error, response) {
//   return (postcode, callback) => { callback(error, response); };
// }

function getPostcodeIOClientFake({ error, response } = {}) {
  const promise = new Promise((resolves, rejects) => {
    // eslint-disable-next-line no-unused-expressions
    (error) ? rejects(error) : resolves(response);
  });

  return { lookup: () => promise };
}

function getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake) {
  // Tried to avoid having to use rewire (since we don't need to use it
  // for stubbing app/middleware/renderer but had no joy with
  // const stub = sinon
  //   .stub(PostcodesIOClient, 'lookup')
  //   .callsFake(() => { console.log('Fake called'); });
  // I think this is because the line PostcodesIO = new PostcodesIOClient(); in the SUT
  const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');

  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);

  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('renderer', rendererFake);

  return postcodeLookup;
}

describe('Postcode lookup', () => {
  describe('PostcodeIO error handling', () => {
    afterEach(() => {
    });
    it('should render an error page for postcode search when postcode.io is not available', async () => {
      const postcodesIOClientFake = {
        lookup: sinon.stub().rejects('Error!')
      };
      const rendererFake = {
        postcodeError: sinon.spy()
      };

      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake);
      await postcodeLookup({}, { locals: { postcodeSearch: 'HG5 0JL' } });

      expectCalledOnce(rendererFake.postcodeError);
      // below is failing as there is more than one parmater being passed to the method?
      // expect(rendererFake.postcodeError.calledOnce('Error!'))
      // .to.equal(true, 'Error not as expected');
    });

    it('should render an invalid postcode page when postcode io thinks it is not a postcode', async () => {
      const rendererFake = {
        postcodeError: sinon.spy()
      };
      const postcodesIOClientFake = getPostcodeIOClientFake();
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake);
      // mockRenderer.expects('invalidPostcodePage').once().withArgs('NOT APOSTCODE');

      await postcodeLookup({}, { locals: { postcodeSearch: 'NOT APOSTCODE' } }, () => { });

      expectCalledOnce(rendererFake.postcodeError);
      // mockRenderer.verify();
    });
  });

  describe('should set locals', () => {
    describe('country should always be mapped to an array', () => {
      // postcode.io returns country as a string for postcodes and array for outcodes
      it('postcode string country should be mapped to array', async () => {
        const res = { locals: { postcodeSearch: 'HG5 0JL' } };
        const postcodesIOClientFake =
          getPostcodeIOClientFake({ response: postcodeSampleResponse_HG50JL });
        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const localsExpectations = getNextExpectations(() => {
          expect(Array.isArray(res.locals.postcodeLocationDetails.country)).to.equal(true, 'Country should be an array');
          expect(res.locals.postcodeLocationDetails.country.length).to.equal(1, 'Number of countries');
          expect(res.locals.postcodeLocationDetails.country[0]).to.equal('England', 'Country');
        });
        const next = getNextSpy(localsExpectations);
        await postcodeLookup({}, res, next);
        expectCalledOnce(next);
      });

      it('outcode string array of countries should be preserved as array', async () => {
        // postcode.io returns country as a string for postcodes and array for outcodes
        const res = { locals: { postcodeSearch: 'TD9' } };
        const postcodesIOClientFake =
          getPostcodeIOClientFake({ response: outcodeSampleResponseCrossBorder_TD9 });

        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const localsExpectations = getNextExpectations(() => {
          expect(Array.isArray(res.locals.postcodeLocationDetails.country)).to.equal(true, 'Country should be an array');
          expect(res.locals.postcodeLocationDetails.country.length).to.equal(2, 'Number of countries');
          expect(res.locals.postcodeLocationDetails.country[0]).to.equal('England', 'Country');
          expect(res.locals.postcodeLocationDetails.country[1]).to.equal('Scotland', 'Country');
        });
        const next = getNextSpy(localsExpectations);

        await postcodeLookup({}, res, next);

        expectCalledOnce(next);
      });
    });

    it('outcode flag should be false if postcode in details', async () => {
      const res = { locals: { postcodeSearch: 'HG5 0JL' } };
      const postcodesIOClientFake =
        getPostcodeIOClientFake({ response: postcodeSampleResponse_HG50JL });
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);
      const localsExpectations = getNextExpectations(() => {
        expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(false, 'res.locals.postcodeLocationDetails.isOutcode');
      });

      const next = getNextSpy(localsExpectations);

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
    });

    it('outcode flag should be true if no postcode in details', async () => {
      const res = { locals: { postcodeSearch: 'HG5' } };
      const postcodesIOClientFake =
        getPostcodeIOClientFake({ response: outcodeSampleResponse_HG5 });
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);
      const localsExpectations = getNextExpectations(() => {
        expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(true, 'res.locals.postcodeLocationDetails.isOutcode');
      });

      const next = getNextSpy(localsExpectations);

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
    });

    it('coordinates should be set for postcode', async () => {
      const postcodesIOClientFake =
        getPostcodeIOClientFake({ response: outcodeSampleResponseCrossBorder_TD9 });
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);
      const res = {
        locals: {
          postcodeSearch: 'HG5'
        }
      };
      const localsExpectations = getNextExpectations(() => {
        expect(res.locals.location.lat).to.equal(55.3977217554393, 'res.locals.location.lat');
        expect(res.locals.location.lon).to.equal(-2.77657929395506, 'res.locals.location.lon');
      });

      const next = getNextSpy(localsExpectations);

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
    });
  });

  it('should not pass postcode location details to next when the postcode is empty', async () => {
    const postcodeLookup = getRewiredPostcodeLookup();

    const res = { locals: { postcodeSearch: '' } };

    const localsExpectations = getNextExpectations(() => {
      expect(res.locals.postcodeLocationDetails).to.equal(undefined, 'res.locals.postcodeLocationDetails');
    });

    const next = getNextSpy(localsExpectations);

    await postcodeLookup({}, res, next);

    expectCalledOnce(next);
  });
});
