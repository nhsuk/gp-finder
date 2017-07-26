const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
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
const expectCalledOnce = spyUtils.expectCalledOnce;

chai.use(chaiAsPromised);
chai.use(chaiArrays);

function getRejectingPostcodeIOClientFake(error) {
  return {
    lookup: sinon.stub().rejects(error)
  };
}

function getResolvingPostcodeIOClientFake(response) {
  return {
    lookup: sinon.stub().resolves(response)
  };
}

function getRendererFake(methodName) {
  const fake = {};
  fake[methodName] = sinon.spy();
  return fake;
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
    it('should render an error page for postcode search when postcode.io is not available', async () => {
      const error = Error('Error!');

      const postcodesIOClientFake = getRejectingPostcodeIOClientFake(error);
      const rendererFake = getRendererFake('postcodeError');

      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake);

      await postcodeLookup({}, { locals: { postcodeSearch: 'HG5 0JL' } });

      expect(rendererFake.postcodeError.calledWith(error)).to.equal(true, 'postcodeError not called');
    });

    it('should render an invalid postcode page when postcode io thinks it is not a postcode', async () => {
      const postcodesIOClientFake = getResolvingPostcodeIOClientFake();
      const rendererFake = getRendererFake('invalidPostcodePage');

      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake);

      await postcodeLookup({}, { locals: { postcodeSearch: 'HG5 0JL' } });

      expect(rendererFake.invalidPostcodePage.calledWith('HG5 0JL')).to.equal(true, 'invalidPostcodePage not called');
    });
  });

  describe('should set locals', () => {
    describe('country should always be mapped to an array', () => {
      // postcode.io returns country as a string for postcodes and array for outcodes
      it('postcode string country should be mapped to array', async () => {
        const res = { locals: { postcodeSearch: 'HG5 0JL' } };
        const postcodesIOClientFake =
          getResolvingPostcodeIOClientFake(postcodeSampleResponse_HG50JL);
        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const next = getNextSpy();

        await postcodeLookup({}, res, next);

        expectCalledOnce(next);
        const countries = res.locals.postcodeLocationDetails.country;
        expect(countries).to.be.array()
          .and.to.be.ofSize(1)
          .and.to.be.equalTo(['England']);
      });

      it('outcode string array of countries should be preserved as array', async () => {
        // postcode.io returns country as a string for postcodes and array for outcodes
        const res = { locals: { postcodeSearch: 'TD9' } };
        const postcodesIOClientFake =
          getResolvingPostcodeIOClientFake(outcodeSampleResponseCrossBorder_TD9);
        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const next = getNextSpy();

        await postcodeLookup({}, res, next);

        expectCalledOnce(next);
        const countries = res.locals.postcodeLocationDetails.country;
        expect(countries).to.be.array()
          .and.to.be.ofSize(2)
          .and.to.be.equalTo(['England', 'Scotland']);
      });
    });

    it('outcode flag should be false if postcode in details', async () => {
      const res = { locals: { postcodeSearch: 'HG5 0JL' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(postcodeSampleResponse_HG50JL);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(false, 'res.locals.postcodeLocationDetails.isOutcode');
    });

    it('outcode flag should be true if no postcode in details', async () => {
      const res = { locals: { postcodeSearch: 'HG5' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(outcodeSampleResponse_HG5);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(true, 'res.locals.postcodeLocationDetails.isOutcode');
    });

    it('coordinates should be set for postcode', async () => {
      const res = { locals: { postcodeSearch: 'TD9' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(outcodeSampleResponseCrossBorder_TD9);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.location.lat).to.equal(55.3977217554393, 'res.locals.location.lat');
      expect(res.locals.postcodeLocationDetails.location.lon).to.equal(-2.77657929395506, 'res.locals.location.lon');
    });
  });

  it('should not pass postcode location details to next when the postcode is empty', async () => {
    const postcodeLookup = getRewiredPostcodeLookup();

    const res = { locals: { postcodeSearch: '' } };

    const next = getNextSpy();

    await postcodeLookup({}, res, next);

    expect(res.locals.postcodeLocationDetails).to.equal(undefined, 'res.locals.postcodeLocationDetails');

    expectCalledOnce(next);
  });
});
