const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

function assertSearchResponse(search, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ search })
    .end(assertions);
}

function searchNameRanking(res, expected) {
  const $ = cheerio.load(res.text);
  const searchResultArr = [];
  const searchResultBase = $('.results__item--nearby .results__details');
  searchResultArr.push($('.results__name', searchResultBase.eq(0)).text().trim());
  searchResultArr.push($('.results__name', searchResultBase.eq(1)).text().trim());
  searchResultArr.push($('.results__name', searchResultBase.eq(2)).text().trim());

  let highRank = false;
  if (searchResultArr.indexOf(expected) > -1) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function searchDoctorRanking(res, expected) {
  const $ = cheerio.load(res.text);
  const searchResultArr = [];
  const searchResultBase = $('.results__item--nearby .results__details');
  searchResultArr.push($('.results__gp', searchResultBase.eq(0)).text().trim());
  searchResultArr.push($('.results__gp', searchResultBase.eq(1)).text().trim());
  searchResultArr.push($('.results__gp', searchResultBase.eq(2)).text().trim());

  let highRank = false;
  if (searchResultArr.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

function searchAddressRanking(res, expected) {
  const $ = cheerio.load(res.text);
  const searchResultArr = [];
  const searchResultBase = $('.results__item--nearby .results__details');
  searchResultArr.push($('.results__address', searchResultBase.eq(0)).text().trim());
  searchResultArr.push($('.results__address', searchResultBase.eq(1)).text().trim());
  searchResultArr.push($('.results__address', searchResultBase.eq(2)).text().trim());

  let highRank = false;
  if (searchResultArr.filter(searchResult => searchResult.includes(expected)).length !== 0) {
    highRank = true;
  }
  expect(highRank).to.equal(true);
}

describe('Results page', () => {
  const noOnlineBookingLinkMessage = 'This surgery doesn&apos;t have an online booking system.';

  describe('page layout', () => {
    it('should contain HTML', (done) => {
      const search = 'Surgery';

      assertSearchResponse(search, (err, res) => {
        iExpect.htmlWith200Status(err, res);
        done();
      });
    });

    it('should contain a header with the string', (done) => {
      const search = 'Surgery';

      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain('Which is your surgery?');
        done();
      });
    });

    describe('matching surgeries found', () => {
      describe('multiple matches', () => {
        it('should have more than one result', (done) => {
          const search = 'Surgery';

          assertSearchResponse(search, (err, res) => {
            const $ = cheerio.load(res.text);
            const searchResults = $('.results__item--nearby');
            expect(searchResults.length).to.equal(30);
            done();
          });
        });
      });
    });

    describe('no matching surgeries found', () => {
      it('should return a descriptive message', (done) => {
        const search = 'asdasdas';
        const errorMessage = `We can't find a surgery matching '${search}'`;

        assertSearchResponse(search, (err, res) => {
          const $ = cheerio.load(res.text);
          const noResultsHeader = $('#content').text();
          expect(noResultsHeader).to.contain(errorMessage);
          done();
        });
      });
    });
  });

  describe('Surgeries without booking system', () => {
    describe('Surgeries with phone number', () => {
      it('should return message to contact reception with phone number link', (done) => {
        const search = 'Bents Green Surgery Sheffield';

        assertSearchResponse(search, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();
          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 0114 236 0641 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('0114 236 0641');
          done();
        });
      });
    });

    describe('Surgeries without phone number', () => {
      it('should return message to contact reception without phone number link', (done) => {
        const search = 'St Martins Healthcare Services';

        assertSearchResponse(search, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();
          expect(searchResults.html()).to.contain(noOnlineBookingLinkMessage);
          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception to book an appointment.');
          done();
        });
      });
    });
  });

  describe('Surgeries with booking system which can be linked to', () => {
    it('should return a booking link for a surgery', (done) => {
      const search = 'Crookes Valley Medical Centre Sheffield';

      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby .results__details .results__name a').first();
        expect(searchResults.text()).to.equal('Crookes Valley Medical Centre');
        expect(searchResults.attr('href')).to.equal('https://systmonline.tpp-uk.com/Login?PracticeId=C88057');
        done();
      });
    });
  });

  describe('Surgeries with booking system which can not be linked to', () => {
    describe('when the surgery has a website', () => {
      it('should return a booking link to the surgery website', (done) => {
        const search = 'Hambleden Surgery';

        assertSearchResponse(search, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details .results__name a').first();
          expect(searchResults.text()).to.equal('Hambleden Surgery');
          expect(searchResults.attr('href')).to.equal('http://www.marlowdoctors.co.uk');
          done();
        });
      });
    });

    describe('when the surgery does not have a website', () => {
      it('should display a call the reception message', (done) => {
        const search = 'Sabden';

        assertSearchResponse(search, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();
          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 01282 772045 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('01282 772045');
          done();
        });
      });
    });
  });

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
    it('of `dr Smith` should rank `Dr Smith & Partners` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Dr Smith & Partners';

      assertSearchResponse(search, (err, res) => {
        searchNameRanking(res, expected);
        done();
      });
    });
  });
  describe('Surgeries with the specific doctor query', () => {
    it('of `dr Smith` should rank `Dr Brian Smith` in the first 3 results', (done) => {
      const search = 'dr Smith';
      const expected = 'Dr Brian Smith';

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
    it('of `Farooq` should rank `Dr. Babar Farooq` in the first 3 results', (done) => {
      const search = 'Farooq';
      const expected = 'Dr. Babar Farooq';

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
