const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const expect = chai.expect;

describe('Postcode lookup', () => {
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

  it('should render an invalid postcode page when postcode io thinks it is not a postcode', () => {
    const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
    const postcodesIOClientFake = {
      lookup: (postcode, callback) => { callback(null, null); }
    };

    const postcodeNotValidSpy = sinon.spy();
    const rendererMock = {
      invalidPostcodePage: postcodeNotValidSpy
    };

    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);
    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('renderer', rendererMock);

    postcodeLookup({}, { locals: { postcode: 'blah' } }, () => {});

    expect(postcodeNotValidSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotValid renderer once');
    expect(postcodeNotValidSpy.calledWith('blah'))
      .to
      .equal(true, 'Should have passed invalid postcode to renderer');
  });

  it('should render a \'Not England\' error page when the postcode is not in England', () => {
    const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
    const postcodesIOClientFake = {
      lookup: (postcode, callback) => { callback(null, { country: 'Scotland' }); }
    };

    const postcodeNotEnglishSpy = sinon.spy();
    const rendererMock = {
      postcodeNotEnglish: postcodeNotEnglishSpy
    };

    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);
    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('renderer', rendererMock);

    postcodeLookup({}, { locals: { postcode: 'TD9 0AA' } }, () => {});

    expect(postcodeNotEnglishSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotEnglish renderer once');
    expect(postcodeNotEnglishSpy.calledWith('TD9 0AA'))
      .to
      .equal(true, 'Should have passed postcode to renderer');
  });

  it('should render a \'Not England\' error page when the outcode is not in England', () => {
    const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
    const postcodesIOClientFake = {
      lookup: (postcode, callback) => {
        callback(null, { country: ['Scotland'] });
      }
    };

    const postcodeNotEnglishSpy = sinon.spy();
    const rendererMock = {
      postcodeNotEnglish: postcodeNotEnglishSpy
    };

    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);
    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('renderer', rendererMock);

    postcodeLookup({}, { locals: { postcode: 'TD9' } }, () => {});

    expect(postcodeNotEnglishSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotEnglish renderer once');
    expect(postcodeNotEnglishSpy.calledWith('TD9'))
      .to
      .equal(true, 'Should have passed outcode to renderer');
  });

  it('should pass the coordinates to next when the postcode is in England', () => {
    const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
    const postcodesIOClientFake = {
      lookup: (postcode, callback) => {
        callback(null, {
          country: 'England',
          longitude: -2.78917095126984,
          latitude: 55.4208564974844
        });
      }
    };

    const res = {
      locals: {
        postcode: 'HG5'
      }
    };
    let called = false;

    const nextSpy = () => {
      called = true;
      expect(res.locals.location.lat).to.not.equal(undefined);
      expect(res.locals.location.lon).to.not.equal(undefined);
    };

    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);

    postcodeLookup({}, res, nextSpy);

    expect(called)
      .to
      .equal(true, 'Should have called next once');
  });

  it('should pass to next when the postcode is empty', () => {
    const postcodeLookup = rewire('../../../app/middleware/postcodeLookup');
    const postcodesIOClientFake = { lookup: () => {} };

    const res = {
      locals: {
        postcode: ''
      }
    };

    // eslint-disable-next-line no-underscore-dangle
    postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);

    const nextSpy2 = sinon.spy();

    postcodeLookup({}, res, nextSpy2);

    expect(nextSpy2.calledOnce)
      .to
      .equal(true, 'Should have called next once');
  });
});
