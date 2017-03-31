const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const messages = require('../../app/lib/messages');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function assertSearchResponse(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

describe('Results page error handling', () => {
  describe('when search is not included', () => {
    it('should return a descriptive error messages', (done) => {
      const search = null;
      const errorMessage = messages.emptySearchMessage();

      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);

        iExpect.homePageEmptyEntry($);
        const errorHeader = $('#content').text();
        expect(errorHeader).to.contain(errorMessage);
        done();
      });
    });
  });

  describe('when search is an empty string', () => {
    const search = '';
    it('should return a descriptive error messages', (done) => {
      const errorMessage = messages.emptySearchMessage();

      assertSearchResponse(search, (err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        iExpect.homePageEmptyEntry($);
        const errorHeader = $('#content').text();
        expect(errorHeader).to.contain(errorMessage);
        done();
      });
    });
    it('should not contain a back link', (done) => {
      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.link-back:first-of-type').length).to.equal(0);
        done();
      });
    });
  });

  describe('when search is some empty spaces', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '   ';
      const errorMessage = messages.emptySearchMessage();

      assertSearchResponse(search, (err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        iExpect.homePageEmptyEntry($);
        const errorHeader = $('#content').text();
        expect(errorHeader).to.contain(errorMessage);
        done();
      });
    });
  });
});
