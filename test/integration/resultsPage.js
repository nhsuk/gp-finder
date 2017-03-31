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

    it('should contain a back link', (done) => {
      const search = 'Surgery';
      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.link-back:first-of-type').eq(0).text()).to.equal('Back');
        expect($('.link-back:first-of-type').eq(1).text()).to.equal('Back');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
        done();
      });
    });

    it('should contain a a header with the search string', (done) => {
      const search = 'Surgery';
      assertSearchResponse(search, (err, res) => {
        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);
        done();
      });
    });

    describe('matching surgeries found', () => {

      describe('single match', () => {
        const search = 'Idle';

        it('should have only one result', (done) => {
          assertSearchResponse(search, (err, res) => {
            const $ = cheerio.load(res.text);

            const searchResults = $('.results__item--nearby');
            expect(searchResults.length).to.equal(1);

            done();
          });
        });

        it('should display singular message text', (done) => {
          assertSearchResponse(search, (err, res) => {
            const $ = cheerio.load(res.text);

            const resultsHeader = $('.results__header').text();
            expect(resultsHeader).to.contain(`GP surgery matching '${search}'`);

            done();
          });
        });

      });

      describe('multiple matches', () => {

        it('should have more than one result', (done) => {
          const search = 'Surgery';
          assertSearchResponse(search, (err, res) => {
            const $ = cheerio.load(res.text);

            const searchResults = $('.results__item--nearby');
            expect(searchResults.length).to.be.above(1);

            done();
          });
        });

        it('should display plural message text', (done) => {
          const search = 'Surgery';
          assertSearchResponse(search, (err, res) => {
            const $ = cheerio.load(res.text);

            const resultsHeader = $('.results__header').text();
            expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

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
});

