const sinon = require('sinon');
const chai = require('chai');
const assertArrays = require('chai-arrays');
const notInEnglandHandler = require('../../../app/middleware/notInEnglandHandler');

const expect = chai.expect;
chai.use(assertArrays);

/* Allow .to.be.[false|true] to improve legibility */
/* eslint-disable no-unused-expressions */
describe('notInEnglandHandler', () => {
  describe('should redirect to outside-england when outside England', () => {
    it('postcode', () => {
      const redirect = sinon.spy();
      const next = sinon.spy();
      const countries = ['Scotland'];
      const res = {
        redirect
      };
      res.locals = {
        postcodeSearch: 'TD9 9AA',
        postcodeLocationDetails: {
          isOutcode: false,
          countries
        }
      };

      notInEnglandHandler({}, res, next);

      expect(redirect.calledOnce).to.be.true;
      expect(redirect.getCall(0).args).to.be.equalTo(['outside-england?postcode=TD9 9AA&isOutcode=false']);
      expect(next.called).to.be.false;
    });

    it('outcode', () => {
      const redirect = sinon.spy();
      const next = sinon.spy();
      const countries = ['Scotland'];
      const res = {
        redirect
      };
      res.locals = {
        postcodeSearch: 'TD9',
        postcodeLocationDetails: {
          isOutcode: true,
          countries
        }
      };

      notInEnglandHandler({}, res, next);

      expect(redirect.calledOnce).to.be.true;
      expect(redirect.getCall(0).args).to.be.equalTo(['outside-england?postcode=TD9&isOutcode=true']);
      expect(next.called).to.be.false;
    });
  });

  describe('should call next when inside England', () => {
    it('postcode wholly in England', () => {
      const locals = {
        postcodeSearch: 'HG5 0JL',
        postcodeLocationDetails: {
          isOutcode: false,
          countries: ['England']
        }
      };
      const next = sinon.spy();

      notInEnglandHandler({}, { locals }, next);

      expect(next.called).to.be.true;
    });

    it('outcode wholly in England', () => {
      const locals = {
        postcodeSearch: 'HG5',
        postcodeLocationDetails: {
          isOutcode: true,
          countries: ['England']
        }
      };
      const next = sinon.spy();

      notInEnglandHandler({}, { locals }, next);

      expect(next.called).to.be.true;
    });

    it('outcode partially in England', () => {
      const locals = {
        postcodeSearch: 'TD9',
        postcodeLocationDetails: {
          isOutcode: true,
          countries: ['England', 'Scotland']
        }
      };
      const next = sinon.spy();

      notInEnglandHandler({}, { locals }, next);

      expect(next.called).to.be.true;
    });
  });

  it('should call next if non-postcode search', () => {
    const next = sinon.spy();

    const locals = {};

    notInEnglandHandler({}, { locals }, next);

    expect(next.called).to.be.true;
  });
});
