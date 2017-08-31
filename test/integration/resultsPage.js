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
  const noOnlineBookingLinkMessage = 'This surgery doesn&apos;t have an online booking system.';

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

  describe('Surgeries without booking system', () => {
    describe('Surgeries with phone number', () => {
      it('should return message to contact reception with phone number link', (done) => {
        const search = 'bushby';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();

          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 0116 241 4956 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('0116 241 4956');
        });
      });
    });

    describe('Surgeries without phone number', () => {
      it('should return message to contact reception without phone number link', (done) => {
        const search = 'Mechanic Institute';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();

          expect(searchResults.html()).to.contain(noOnlineBookingLinkMessage);
          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception to book an appointment.');
        });
      });
    });
  });

  describe('Surgeries with booking system which can be linked to', () => {
    it('should return a booking link for a surgery', (done) => {
      const search = 'Medi Access';
      const postcode = '';

      assertSearchResponse(search, postcode, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby .results__details .results__name a').first();

        expect(searchResults.text()).to.equal('Medi Access Ltd');
        expect(searchResults.attr('href')).to.equal('https://systmonline.tpp-uk.com/Login?PracticeId=B81693');
      });
    });
  });

  describe('Surgeries with booking system which can not be linked to', () => {
    describe('when the surgery has a website', () => {
      it('should return a booking link to the surgery website', (done) => {
        const search = 'Sunlight Centre Surgery';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details .results__name a').first();

          expect(searchResults.text()).to.equal('Sunlight Centre Surgery');
          expect(searchResults.attr('href')).to.equal('http://www.sunlightsurgery.co.uk');
        });
      });
    });

    describe('when the surgery does not have a website', () => {
      it('should display a call the reception message', (done) => {
        const search = 'Blewbury Surgery';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();

          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 01235 517760 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('01235 517760');
        });
      });
    });
  });
});
