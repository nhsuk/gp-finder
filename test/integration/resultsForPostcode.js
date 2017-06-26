const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

const RESULTS_THRESHOLD = 2;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function makeSearchRequestAndCheckExpectations(search, postcode, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search, postcode })
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
    it(`of 'HG5 0JL' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = '';
      const postcode = 'HG5 0JL';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });
    it(`of 'HG5 0JL ' should rank trim the postcode and rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = '';
      const postcode = 'HG5 0JL ';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });
  });

  describe('Search by valid outcode', () => {
    it(`of 'HG5' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = '';
      const postcode = 'HG5';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, (err, res) => {
        expectHighRankForPostcode(res, expected, RESULTS_THRESHOLD);
        done();
      });
    });
  });

  describe('Search by valid out of England outcode', () => {
    // TODO:
  });

  describe('Search by valid out of England postcode', () => {
    // TODO:
  });

  describe('Search by invalid postcode', () => {
    // TODO:
  });
});
