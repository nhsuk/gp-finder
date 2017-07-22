const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const expect = chai.expect;

describe('notInEnglandHandler', () => {
  it('should render a \'Not England\' error page when the outcode is not in England', () => {
    const notInEnglandHandler = rewire('../../../app/middleware/notInEnglandHandler');
    const postcodeLocationDetails = {
      country: ['Scotland'],
    };

    const postcodeNotEnglishSpy = sinon.spy();
    const rendererMock = {
      postcodeNotEnglish: postcodeNotEnglishSpy
    };

    // eslint-disable-next-line no-underscore-dangle
    notInEnglandHandler.__set__('renderer', rendererMock);

    const locals = {
      postcodeSearch: 'TD9',
      postcodeLocationDetails
    };

    notInEnglandHandler({}, { locals }, () => {});

    expect(postcodeNotEnglishSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotEnglish renderer once');
    expect(postcodeNotEnglishSpy.calledWith('TD9'))
      .to
      .equal(true, 'Should have passed postcode to renderer');
  });

  it('should render a \'Not England\' error page when the postcode is not in England', () => {
    const notInEnglandHandler = rewire('../../../app/middleware/notInEnglandHandler');

    const postcodeNotEnglishSpy = sinon.spy();
    const rendererMock = {
      postcodeNotEnglish: postcodeNotEnglishSpy
    };

    // eslint-disable-next-line no-underscore-dangle
    notInEnglandHandler.__set__('renderer', rendererMock);

    const postcodeLocationDetails = {
      country: ['Scotland']
    };

    const locals = {
      postcodeSearch: 'TD9 0AA',
      postcodeLocationDetails
    };

    notInEnglandHandler({}, { locals }, () => {});

    expect(postcodeNotEnglishSpy.calledOnce)
      .to
      .equal(true, 'Should have called postcodeNotEnglish renderer once');
    expect(postcodeNotEnglishSpy.calledWith('TD9 0AA'))
      .to
      .equal(true, 'Should have passed postcode to renderer');
  });

  it('should pass to next if postcode/outcode is in England', () => {
    const notInEnglandHandler = rewire('../../../app/middleware/notInEnglandHandler');

    const nextSpy = sinon.spy();

    const postcodeLocationDetails = {
      postcode: 'HG5 0JL',
      country: ['England']
    };

    notInEnglandHandler({}, { locals: { postcodeLocationDetails } }, nextSpy);

    expect(nextSpy.calledOnce)
      .to
      .equal(true, 'Should have called next once');
  });

  it('should pass to next if non-postcode search', () => {
    const notInEnglandHandler = rewire('../../../app/middleware/notInEnglandHandler');

    const nextSpy = sinon.spy();

    const locals = {};

    notInEnglandHandler({}, { locals }, nextSpy);

    expect(nextSpy.calledOnce)
      .to
      .equal(true, 'Should have called next once');
  });
});
