const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

const RESULTS_THRESHOLD = 2;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function makeSearchRequestAndCheckExpectations(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

function rankTopResults(res, className, resultsThreshold) {
  const $ = cheerio.load(res.text);
  const searchResults = [];

  for (let i = 0; i < resultsThreshold; i++) {
    searchResults.push($(className, $('.results__item--nearby .results__details').eq(i)).text().trim());
  }

  return searchResults;
}

function expectHighRankForPostcode(res, expected, resultsThreshold) {
  const searchResults = rankTopResults(res, '.results__name', resultsThreshold);
  const highRank = (searchResults.indexOf(expected) > -1);

  expect(highRank).to.equal(true, `expected '${expected}' in top ${resultsThreshold} results (${searchResults})`);
}

describe('Results page with postcode search', () => {
  describe('Search by valid full postcode', () => {
    it('of \'HG5 0JL\' when search is not there should ignore search param', (done) => {
      const search = 'HG5 0JL';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        const $ = cheerio.load(res.text);
        const pageTitle = $('.page-title').text();
        const resultsHeader = $('.results__header').text();

        expect(pageTitle).to.not.contain('Sorry, we are experiencing technical problems');
        expect(resultsHeader).to.contain('Which is your surgery?');
        done();
      });
    });

    it(`of 'HG5 0JL' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'HG5 0JL';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });

    it(`of 'HG5 0JL ' should rank trim the postcode and rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'HG5 0JL ';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });
  });

  describe('Search by postcode and name', () => {
    it('of \'HG5 0JL\' and \'Park Parade\' should rank \'Park Parade Surgery\' as the top result', (done) => {
      const search = 'Park Parade HG5 0JL';
      const expected = 'Park Parade Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForPostcode(res, expected, 1);
        done();
      });
    });
  });

  describe('Search by valid outcode', () => {
    it('of \'HG5\' when search is not there should ignore search param', (done) => {
      const search = 'HG5';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        const $ = cheerio.load(res.text);
        const pageTitle = $('.page-title').text();
        const resultsHeader = $('.results__header').text();

        expect(pageTitle).to.not.contain('Sorry, we are experiencing technical problems');
        expect(resultsHeader).to.contain('Which is your surgery?');
        done();
      });
    });

    it(`of 'HG5' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'HG5';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });
  });
});
