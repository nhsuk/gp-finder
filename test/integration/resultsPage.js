const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function assertSearchResponse(search, postcode, done, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search, postcode })
    .end((err, res) => {
      iExpect.htmlWith200Status(err, res);
      assertions(err, res);
      done();
    });
}

describe('Results page', () => {
  describe('layout', () => {
    it('should contain HTML', (done) => {
      const search = 'Surgery';
      const postcode = '';

      assertSearchResponse(search, postcode, done, (err, res) => {
        iExpect.htmlWith200Status(err, res);
      });
    });

    it('should contain a header with the string', (done) => {
      const search = 'Surgery';
      const postcode = '';

      assertSearchResponse(search, postcode, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = $('.results__header').text();

        expect(resultsHeader).to.contain('Which is your surgery?');
      });
    });

    it('should contain meta data with results information', (done) => {
      const search = 'Surgery';
      const postcode = '';

      assertSearchResponse(search, postcode, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsLimit = $('meta[name="DCSext.GPResultsLimit"]').attr('content');
        const totalResults = $('meta[name="DCSext.GPTotalResults"]').attr('content');

        expect(resultsLimit).to.eq('30');
        expect(totalResults).to.eq('3378');
      });
    });

    describe('matching surgeries found', () => {
      describe('multiple matches', () => {
        it('should have more than one result', (done) => {
          const search = 'Surgery';
          const postcode = '';

          assertSearchResponse(search, postcode, done, (err, res) => {
            const $ = cheerio.load(res.text);
            const searchResults = $('.results__item--nearby');

            expect(searchResults.length).to.equal(30);
          });
        });
      });
    });

    describe('no matching surgeries found', () => {
      it('should return a descriptive message when searching by name', (done) => {
        const search = 'asdasdas';
        const postcode = '';
        const errorMessage = `We can not find a surgery using '${search}'`;

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const noResultsHeader = $('#content').text();

          expect(noResultsHeader).to.contain(errorMessage);
        });
      });

      it('should return a descriptive message when searching by name and postcode', (done) => {
        const search = 'dave';
        const postcode = 'TR21 0HE';
        const errorMessage = `We can not find a surgery near to '${postcode}' using '${search}'`;

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const noResultsHeader = $('#content').text();

          expect(noResultsHeader).to.contain(errorMessage);
        });
      });
    });
  });
});
