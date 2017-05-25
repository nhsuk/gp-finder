const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function makeSearchRequestAndCheckExpectations(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

function rankTop3Results(res, className) {
  const $ = cheerio.load(res.text);
  const searchResults = [];
  for (let i = 0; i < 3; i++) {
    searchResults.push($(className, $('.results__item--nearby .results__details').eq(i)).text().trim());
  }
  return searchResults;
}

function expectHighRankForName(res, expected) {
  const searchResults = rankTop3Results(res, '.results__name');
  let highRank = false;
  if (searchResults.indexOf(expected) > -1) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function expectHighRankForDoctor(res, expected) {
  const searchResults = rankTop3Results(res, '.results__gp');
  let highRank = false;
  if (searchResults.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function expectHighRankForAddress(res, expected) {
  const searchResults = rankTop3Results(res, '.results__address');
  let highRank = false;
  if (searchResults.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

describe('Results page with ranking', () => {
  describe('Surgeries with the specific surgery query', () => {
    it('of `park parade` should rank `Park Parade Surgery` in the first 3 results', (done) => {
      const search = 'park parade';
      const expected = 'Park Parade Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
    it('of `Street Lane` should rank `Street Lane Practice` in the first 3 results', (done) => {
      const search = 'Street Lane';
      const expected = 'Street Lane Practice';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
    it('of `Baker` should rank `Dr D Baker & Partner` in the first 3 results', (done) => {
      const search = 'Baker';
      const expected = 'Dr D Baker & Partner';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
    it('of `Miller` should rank `Miller Street Surgery` in the first 3 results', (done) => {
      const search = 'Miller';
      const expected = 'Miller Street Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
    it('of `Smith` should rank `Smith & Partners` in the first 3 results', (done) => {
      const search = 'Smith';
      const expected = 'Smith & Partners';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
    it('of `dr Smith` should rank `Smith & Partners` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Smith & Partners';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForName(res, expected);
        done();
      });
    });
  });
  describe('Surgeries with the specific doctor query', () => {
    it('of `dr Smith` should rank `Dr Andrew Smith` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Dr Andrew Smith';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `doctor Smith` should rank `Dr Andrew Smith` in the first 3 results', (done) => {
      const search = 'doctor Smith';
      const expected = 'Dr Andrew Smith';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `Baker` should rank `Dr David John Baker` in the first 3 results', (done) => {
      const search = 'Baker';
      const expected = 'Dr David John Baker';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `Farooq` should rank `Dr Babar Farooq` in the first 3 results', (done) => {
      const search = 'Farooq';
      const expected = 'Dr Babar Farooq';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `Louise Miller` should rank `Dr Louise Miller` in the first 3 results', (done) => {
      const search = 'Louise Miller';
      const expected = 'Dr Louise Miller';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `Doctor Monisha Kurian` should rank `Dr Monisha Kurian` in the first 3 results', (done) => {
      const search = 'Doctor Monisha Kurian';
      const expected = 'Dr Monisha Kurian';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    it('of `Dr Ramdeehul` should rank `Dr Amal Ramdeehul` in the first 3 results', (done) => {
      const search = 'Dr Ramdeehul';
      const expected = 'Dr Amal Ramdeehul';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForDoctor(res, expected);
        done();
      });
    });
    describe('Doctors names which include punctuation', () => {
      it('of `Yule-Smith` should rank `Dr Annabel Louise Yule-Smith` in the first 3 results', (done) => {
        const search = 'Yule-Smith';
        const expected = 'Dr Annabel Louise Yule-smith';

        makeSearchRequestAndCheckExpectations(search, (err, res) => {
          expectHighRankForDoctor(res, expected);
          done();
        });
      });
      it('of `Karen O\'Connor` should rank `Dr Karen O\'Connor` in the first 3 results', (done) => {
        const search = 'Karen O\'Connor';
        const expected = 'Dr Karen O\'connor';

        makeSearchRequestAndCheckExpectations(search, (err, res) => {
          expectHighRankForDoctor(res, expected);
          done();
        });
      });
    });
  });
  describe('Surgeries with the specific surgery query that exist in the address', () => {
    it('with `Ireland Wood` should rank `Ireland Wood Surgery` in the first 3 results', (done) => {
      const search = 'Ireland Wood';
      const expected = 'Ireland Wood Surgery';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForAddress(res, expected);
        done();
      });
    });
    it('with `Idle` should rank `Idle Medical Centre` in the first 3 results', (done) => {
      const search = 'Idle';
      const expected = 'Idle Medical Centre';

      makeSearchRequestAndCheckExpectations(search, (err, res) => {
        expectHighRankForAddress(res, expected);
        done();
      });
    });
  });
});
