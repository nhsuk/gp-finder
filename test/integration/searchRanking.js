const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function assertSearchResponse(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

function rankingInResults(res, className) {
  const $ = cheerio.load(res.text);
  const searchResults = [];
  for (let i = 0; i < 3; i++) {
    searchResults.push($(className, $('.results__item--nearby .results__details').eq(i)).text().trim());
  }
  return searchResults;
}

function searchNameRanking(res, expected) {
  const searchResults = rankingInResults(res, '.results__name');
  let highRank = false;
  if (searchResults.indexOf(expected) > -1) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function searchDoctorRanking(res, expected) {
  const searchResults = rankingInResults(res, '.results__gp');
  let highRank = false;
  if (searchResults.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function searchAddressRanking(res, expected) {
  const searchResults = rankingInResults(res, '.results__address');
  let highRank = false;
  if (searchResults.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

describe('Results page /w ranking', () => {
  describe('Surgeries with the specific surgery query', () => {
    it('of `park parade` should rank `Park Parade Surgery` in the first 3 results', (done) => {
      const search = 'park parade';
      const expected = 'Park Parade Surgery';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
    it('of `Street Lane` should rank `Street Lane Practice` in the first 3 results', (done) => {
      const search = 'Street Lane';
      const expected = 'Street Lane Practice';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
    it('of `Baker` should rank `Dr D Baker & Partner` in the first 3 results', (done) => {
      const search = 'Baker';
      const expected = 'Dr D Baker & Partner';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
    it('of `Miller` should rank `Miller Street Surgery` in the first 3 results', (done) => {
      const search = 'Miller';
      const expected = 'Miller Street Surgery';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
    it('of `Smith` should rank `Smith & Partners` in the first 3 results', (done) => {
      const search = 'Smith';
      const expected = 'Smith & Partners';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
    it('of `dr Smith` should rank `Smith & Partners` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Smith & Partners';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
  });
  describe('Surgeries with the specific doctor query', () => {
    it('of `dr Smith` should rank `Dr Andrew Smith` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Dr Andrew Smith';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `doctor Smith` should rank `Dr Andrew Smith` in the first 3 results', (done) => {
      const search = 'doctor Smith';
      const expected = 'Dr Andrew Smith';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Baker` should rank `Dr David John Baker` in the first 3 results', (done) => {
      const search = 'Baker';
      const expected = 'Dr David John Baker';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Farooq` should rank `Dr Babar Farooq` in the first 3 results', (done) => {
      const search = 'Farooq';
      const expected = 'Dr Babar Farooq';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Louise Miller` should rank `Dr Louise Miller` in the first 3 results', (done) => {
      const search = 'Louise Miller';
      const expected = 'Dr Louise Miller';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Doctor Monisha Kurian` should rank `Dr Monisha Kurian` in the first 3 results', (done) => {
      const search = 'Doctor Monisha Kurian';
      const expected = 'Dr Monisha Kurian';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Dr Ramdeehul` should rank `Dr Amal Ramdeehul` in the first 3 results', (done) => {
      const search = 'Dr Ramdeehul';
      const expected = 'Dr Amal Ramdeehul';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
    it('of `Yule-Smith` should rank `Dr Annabel Louise Yule-Smith` in the first 3 results', (done) => {
      const search = 'Yule-Smith';
      const expected = 'Dr Annabel Louise Yule-smith';

      assertSearchResponse(search, (err, res) => {
        searchDoctorRanking(res, expected);
        done();
      });
    });
  });
  describe('Surgeries with the specific surgery query that exist in the address', () => {
    it('with `Ireland Wood` should rank `Ireland Wood Surgery` in the first 3 results', (done) => {
      const search = 'Ireland Wood';
      const expected = 'Ireland Wood Surgery';

      assertSearchResponse(search, (err, res) => {
        searchAddressRanking(res, expected);
        done();
      });
    });
    it('with `Idle` should rank `Idle Medical Centre` in the first 3 results', (done) => {
      const search = 'Idle';
      const expected = 'Idle Medical Centre';

      assertSearchResponse(search, (err, res) => {
        searchAddressRanking(res, expected);
        done();
      });
    });
  });
});
