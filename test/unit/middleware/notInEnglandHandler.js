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
    it('should call postcodeNotEnglish when the outcode is wholly outside England', () => {
      const locals = {
        postcodeSearch: 'TD9',
        postcodeLocationDetails: {
          countries: ['Scotland']
        }
      };
      mockRenderer.expects('postcodeNotEnglish').once().withArgs('TD9');
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      expectNotCalled(next);
    });

    it('should call next when the outcode is wholly in England', () => {
      const locals = {
        postcodeSearch: 'HG5',
        postcodeLocationDetails: {
          countries: ['England']
        }
      };
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      expectCalledOnce(next);
    });

    it('should call next when the outcode is partially in England', () => {
      const locals = {
        postcodeSearch: 'TD9',
        postcodeLocationDetails: {
          countries: ['England', 'Scotland']
        }
      };
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      expectCalledOnce(next);
    });

    it('should call postcodeNotEnglish when the postcode is not in England', () => {
      const locals = {
        postcodeSearch: 'TD9 0AA',
        postcodeLocationDetails: {
          countries: ['Scotland']
        }
      };
      mockRenderer.expects('postcodeNotEnglish').once().withArgs('TD9 0AA');
      const next = getNextSpy();

      notInEnglandHandler({}, { locals }, next);

      mockRenderer.verify();
      expectNotCalled(next);
    });
  });

  it('should call next if non-postcode search', () => {
    const next = getNextSpy();

    const locals = {};

    notInEnglandHandler({}, { locals }, next);

    expectCalledOnce(next);
  });
});
