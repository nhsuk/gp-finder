const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function assertSearchResponse(search, postcode, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search, postcode })
    .end(assertions);
}

function assertEmptyResponse(search, postcode, done) {
  assertSearchResponse(search, postcode, (err, res) => {
    const $ = cheerio.load(res.text);

    expect($('title').html()).to.match(/^Please retry - What&apos;s your GP surgery&apos;s name?/);
    expect($('.form--error .form-item-wrapper > h2').text()).to.contain('You need to enter some text');

    done();
  });
}

function assertInvalidPostcodeResponse(search, postcode, done) {
  assertSearchResponse(search, postcode, (err, res) => {
    const $ = cheerio.load(res.text);

    expect($('title').html()).to.match(/^Please retry - What&apos;s your GP surgery&apos;s name?/);
    expect($('.form-item-wrapper').text()).to.contain('The postcode');
    expect($('.form-item-wrapper').text()).to.contain('does not exist');

    done();
  });
}

describe('Results page error handling', () => {
  describe('when search and postcode are not included', () => {
    it('should return a descriptive error messages', (done) => {
      const search = undefined;
      const postcode = undefined;
      assertEmptyResponse(search, postcode, done);
    });
  });

  describe('when search is empty but postcode is not included', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '';
      const postcode = undefined;
      assertEmptyResponse(search, postcode, done);
    });
  });

  describe('when search is not includes but postcode is empty', () => {
    it('should return a descriptive error messages', (done) => {
      const search = undefined;
      const postcode = '';
      assertEmptyResponse(search, postcode, done);
    });
  });

  describe('when search is some empty spaces & postcode is empty', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '   ';
      const postcode = '';
      assertEmptyResponse(search, postcode, done);
    });
  });

  describe('when search is empty & postcode is some empty spaces', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '';
      const postcode = '   ';
      assertEmptyResponse(search, postcode, done);
    });
  });

  describe('when search and postcode are empty strings', () => {
    const search = '';
    const postcode = '';

    it('should return a descriptive error messages', (done) => {
      assertEmptyResponse(search, postcode, done);
    });

    it('should not contain a back link', (done) => {
      assertSearchResponse(search, postcode, (err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.link-back:first-of-type').length).to.equal(0);
        done();
      });
    });
  });

  describe('when search is not included & postcode is an invalid outcode', () => {
    it('should return a descriptive error messages', (done) => {
      const search = undefined;
      const postcode = 'S50';
      assertInvalidPostcodeResponse(search, postcode, done);
    });
  });

  describe('when search is not included & postcode is an invalid postcode', () => {
    it('should return a descriptive error messages', (done) => {
      const search = undefined;
      const postcode = 'S50 3EW';
      assertInvalidPostcodeResponse(search, postcode, done);
    });
  });
});
