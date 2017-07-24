const sinon = require('sinon');
const spyUtils = require('../../lib/spy-utils');
const renderer = require('../../../app/middleware/renderer');
const notInEnglandHandler = require('../../../app/middleware/notInEnglandHandler');

const expectNotCalled = spyUtils.expectNotCalled;
const expectCalledOnce = spyUtils.expectCalledOnce;
const getNextSpy = spyUtils.getNextSpy;

describe('notInEnglandHandler', () => {
  describe('outside England', () => {
    let mockRenderer;
    beforeEach(() => {
      mockRenderer = sinon.mock(renderer);
    });
    afterEach(() => {
      mockRenderer.verify();
      mockRenderer.restore();
    });
    it('should render a \'Not England\' error page when the outcode is not in England', () => {
      const locals = {
        postcodeSearch: 'TD9',
        postcodeLocationDetails: {
          country: ['Scotland']
        }
      };
      mockRenderer.expects('postcodeNotEnglish').once().withArgs('TD9');
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      expectNotCalled(next);
    });

    it('should render a \'Not England\' error page when the postcode is not in England', () => {
      const locals = {
        postcodeSearch: 'TD9 0AA',
        postcodeLocationDetails: {
          country: ['Scotland']
        }
      };
      mockRenderer.expects('postcodeNotEnglish').once().withArgs('TD9 0AA');
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      mockRenderer.verify();
      expectNotCalled(next);
    });
  });

  it('should pass to next if postcode/outcode is in England', () => {
    const postcodeLocationDetails = {
      postcode: 'HG5 0JL',
      country: ['England']
    };

    const next = getNextSpy();

    notInEnglandHandler({}, { locals: { postcodeLocationDetails } }, next);

    expectCalledOnce(next);
  });

  it('should pass to next if non-postcode search', () => {
    const next = getNextSpy();

    const locals = {};

    notInEnglandHandler({}, { locals }, next);

    expectCalledOnce(next);
  });
});
