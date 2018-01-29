const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

const RESULTS_THRESHOLD = 2;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function makeSearchRequestAndCheckExpectations(search, done, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end((err, res) => {
      iExpect.htmlWith200Status(err, res);
      assertions(err, res);
      done();
    });
}

function rankTopResults(res, className, resultsThreshold) {
  const $ = cheerio.load(res.text);
  const searchResults = [];

  for (let i = 0; i < resultsThreshold; i++) {
    searchResults.push($(className, $('.results__item--nearby .results__details').eq(i)).text().trim());
  }

  return searchResults;
}

function expectHighRankForName(res, expected, resultsThreshold) {
  const searchResults = rankTopResults(res, '.results__name', resultsThreshold);
  const highRank = (searchResults.indexOf(expected) > -1);

  expect(highRank).to.equal(true, `expected '${expected}' in top ${resultsThreshold} results (${searchResults})`);
}

function expectHighRankForAddress(res, expected, resultsThreshold) {
  const searchResults = rankTopResults(res, '.results__address', resultsThreshold);
  const highRank =
    searchResults.some(searchResult => searchResult.includes(expected));

  expect(highRank).to.equal(true, `expected '${expected}' in top ${resultsThreshold} results (${searchResults})`);
}

describe('Results page with ranking', () => {
  describe('Search by postcode', () => {
    it('of \'HG5 0JL\' should rank \'Beech House Surgery\' as the top result', (done) => {
      const search = 'HG5 0JL';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, 1);
      });
    });

    it(`of 'HG5' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'HG5';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });
  });

  describe('Surgeries with the specific surgery query', () => {
    it(`of 'park parade' should rank 'Park Parade Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'park parade';
      const expected = 'Park Parade Surgery';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Street Lane' should rank 'Street Lane Practice' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Street Lane';
      const expected = 'The Street Lane Practice';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Baker' should rank 'Dr Baker & Partners Practice' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Baker';
      const expected = 'Dr Baker & Partners Practice';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Miller' should rank 'Miller Street Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Miller';
      const expected = 'Miller Street Surgery';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });
  });

  describe('Surgeries with the specific surgery query that exist in the address', () => {
    it(`with 'Ireland Wood' should rank 'Ireland Wood Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Ireland Wood';
      const expected = 'Iveson Approach';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForAddress(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`with 'Idle' should rank '440 Highfield Road' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Idle';
      const expected = '440 Highfield Road';

      makeSearchRequestAndCheckExpectations(search, done, (err, res) => {
        expectHighRankForAddress(res, expected, RESULTS_THRESHOLD);
      });
    });
  });
});
