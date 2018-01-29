const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

const retryRegex = /^Please retry - Enter your GP surgery&apos;s name or your home postcode/;

function assertSearchResponse(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

function assertEmptyResponse(search, done) {
  assertSearchResponse(search, (err, res) => {
    const $ = cheerio.load(res.text);

    expect($('title').html()).to.match(retryRegex);
    expect($('.form--error .form-item-wrapper > h2').text()).to.contain('You need to enter some text');

    done();
  });
}

describe('Results page error handling', () => {
  describe('when search is undefined', () => {
    it('should return a descriptive error messages', (done) => {
      const search = undefined;
      assertEmptyResponse(search, done);
    });
  });

  describe('when search is empty', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '';
      assertEmptyResponse(search, done);
    });
    it('should not contain a back link', (done) => {
      const search = '';
      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.link-back:first-of-type').length).to.equal(0);
        done();
      });
    });
  });

  describe('when search contains white space', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '   ';
      assertEmptyResponse(search, done);
    });
  });
});
