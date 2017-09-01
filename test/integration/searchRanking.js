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

function makeSearchRequestAndCheckExpectations(search, postcode, done, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search, postcode })
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

function expectHighRankForDoctor(res, expected, resultsThreshold) {
  const searchResults = rankTopResults(res, '.results__gp', resultsThreshold);
  const highRank =
    searchResults.some(searchResult => searchResult.includes(expected));

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
      const search = 'Beech';
      const postcode = 'HG5 0JL';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, 1);
      });
    });

    it(`of 'HG5' should rank 'Beech House Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = '';
      const postcode = 'HG5';
      const expected = 'Beech House Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });
  });

  describe('Surgeries with the specific surgery query', () => {
    const postcode = '';
    it(`of 'park parade' should rank 'Park Parade Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'park parade';
      const expected = 'Park Parade Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Street Lane' should rank 'Street Lane Practice' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Street Lane';
      const expected = 'The Street Lane Practice';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Baker' should rank 'Dr Baker & Partners Practice' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Baker';
      const expected = 'Dr Baker & Partners Practice';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Miller' should rank 'Miller Street Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Miller';
      const expected = 'Miller Street Surgery';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Andrew Smith' should rank 'Dr Darcy & Partners' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Andrew Smith';
      const expected = 'Dr Darcy & Partners';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'dr Andrew Smith' should rank 'Dr Darcy & Partners' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'dr Andrew Smith';
      const expected = 'Dr Darcy & Partners';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForName(res, expected, RESULTS_THRESHOLD);
      });
    });
  });

  describe('Surgeries with the specific doctor query', () => {
    const postcode = '';
    it(`of 'dr Andrew Smith' should rank 'Dr Andrew Smith' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'dr Andrew Smith';
      const expected = 'Dr Andrew Smith';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Doctor Andrew Smith' should rank 'Dr Andrew Smith' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Doctor Andrew Smith';
      const expected = 'Dr Andrew Smith';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Baker' should rank 'Dr Jack Baker' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Baker';
      const expected = 'Dr Jack Baker';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Babar Farooq' should rank 'Dr Babar Farooq' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Babar Farooq';
      const expected = 'Dr Babar Farooq';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Louise Miller' should rank 'Dr Louise Miller' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Louise Miller';
      const expected = 'Dr Louise Miller';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Doctor Monisha Kurian' should rank 'Dr Monisha Kurian' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Doctor Monisha Kurian';
      const expected = 'Dr Monisha Kurian';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`of 'Dr Ramdeehul' should rank 'Dr Amal Ramdeehul' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const search = 'Dr Ramdeehul';
      const expected = 'Dr Amal Ramdeehul';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
      });
    });

    describe('Doctors names which include punctuation', () => {
      it(`of 'Yule-Smith' should rank 'Dr Annabel Louise Yule-Smith' in the first ${RESULTS_THRESHOLD} results`, (done) => {
        const search = 'Yule-Smith';
        const expected = 'Dr Annabel Louise Yule-smith';

        makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
          expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
        });
      });

      it(`of "Karen O'Connor" should rank "Dr Karen O'Connor" in the first ${RESULTS_THRESHOLD} results`, (done) => {
        const search = 'Karen O\'Connor';
        const expected = 'Dr Karen O\'connor';

        makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
          expectHighRankForDoctor(res, expected, RESULTS_THRESHOLD);
        });
      });
    });
  });

  describe('Surgeries with the specific surgery query that exist in the address', () => {
    it(`with 'Ireland Wood' should rank 'Ireland Wood Surgery' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const postcode = '';
      const search = 'Ireland Wood';
      const expected = 'Iveson Approach';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForAddress(res, expected, RESULTS_THRESHOLD);
      });
    });

    it(`with 'Idle' should rank '440 Highfield Road' in the first ${RESULTS_THRESHOLD} results`, (done) => {
      const postcode = '';
      const search = 'Idle';
      const expected = '440 Highfield Road';

      makeSearchRequestAndCheckExpectations(search, postcode, done, (err, res) => {
        expectHighRankForAddress(res, expected, RESULTS_THRESHOLD);
      });
    });
  });
});
