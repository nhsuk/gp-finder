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
        const search = 'Bents Green Surgery Sheffield';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();

          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 0114 236 0641 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('0114 236 0641');
        });
      });
    });

    describe('Surgeries without phone number', () => {
      it('should return message to contact reception without phone number link', (done) => {
        const search = 'St Martins Healthcare Services';
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
      const search = 'Crookes Valley Medical Centre Sheffield';
      const postcode = '';

      assertSearchResponse(search, postcode, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby .results__details .results__name a').first();

        expect(searchResults.text()).to.equal('Crookes Valley Medical Centre');
        expect(searchResults.attr('href')).to.equal('https://systmonline.tpp-uk.com/Login?PracticeId=C88057');
      });
    });
  });

  describe('Surgeries with booking system which can not be linked to', () => {
    describe('when the surgery has a website', () => {
      it('should return a booking link to the surgery website', (done) => {
        const search = 'Hambleden Surgery';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details .results__name a').first();

          expect(searchResults.text()).to.equal('Hambleden Surgery');
          expect(searchResults.attr('href')).to.equal('http://www.marlowdoctors.co.uk');
        });
      });
    });

    describe('when the surgery does not have a website', () => {
      it('should display a call the reception message', (done) => {
        const search = 'Sabden';
        const postcode = '';

        assertSearchResponse(search, postcode, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby .results__details').first();

          expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception on 01282 772045 to book an appointment.');
          expect($('a[href^="tel:"]', searchResults).text()).to.equal('01282 772045');
        });
      });
    });
  });
});
