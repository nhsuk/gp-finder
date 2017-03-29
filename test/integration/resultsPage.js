const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const messages = require('../../app/lib/messages');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;

describe('Results page', () => {
  const noOnlineBookingLinkMessage = 'This surgery doesn&apos;t have an online booking system.';

  describe('page layout', () => {
    const search = 'Surgery';
    it('should contain HTML', (done) => {
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          done();
        });
    });
    it('should contain a back link', (done) => {
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          expect($('.link-back:first-of-type').eq(0).text()).to.equal('Back');
          expect($('.link-back:first-of-type').eq(1).text()).to.equal('Back');
          expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
          done();
        });
    });
    it('should contain a a header with the search string', (done) => {
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
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
          chai.request(app)
            .get(resultsRoute)
            .query({ search })
            .end((err, res) => {
              const $ = cheerio.load(res.text);

              const searchResults = $('.results__item--nearby');
              expect(searchResults.length).to.equal(1);

              done();
            });
        });
        it('should display singular message text', (done) => {
          chai.request(app)
            .get(resultsRoute)
            .query({ search })
            .end((err, res) => {
              const $ = cheerio.load(res.text);

              const resultsHeader = $('.results__header').text();
              expect(resultsHeader).to.contain(`GP surgery matching '${search}'`);

              done();
            });
        });
      });
      describe('multiple matches', () => {
        it('should have more than one result', (done) => {
          chai.request(app)
            .get(resultsRoute)
            .query({ search })
            .end((err, res) => {
              const $ = cheerio.load(res.text);

              const searchResults = $('.results__item--nearby');
              expect(searchResults.length).to.be.above(1);

              done();
            });
        });
        it('should display plural message text', (done) => {
          const search = 'Surgery';
          chai.request(app)
            .get(resultsRoute)
            .query({ search })
            .end((err, res) => {
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

        chai.request(app)
          .get(resultsRoute)
          .query({ search })
          .end((err, res) => {
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
        chai.request(app)
          .get(resultsRoute)
          .query({ search })
          .end((err, res) => {

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
        chai.request(app)
          .get(resultsRoute)
          .query({ search })
          .end((err, res) => {
            const $ = cheerio.load(res.text);

            const searchResults = $('.results__item--nearby .results__details').first();
            expect(searchResults.html()).to.contain(noOnlineBookingLinkMessage);
            expect($('.callout p', searchResults).text().trim()).to.equal('This surgery doesn\'t have an online booking system. Call reception to book an appointment.');

            done();
          });
      });
    });

  });

  describe('Surgeries with booking system', () => {
    it('should return a booking link for a surgery', (done) => {
      const search = 'Crookes Valley Medical Centre Sheffield';
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          const resultsHeader = $('.results__header').text();
          expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

          const searchResults = $('.results__item--nearby .results__details').first();
          expect(searchResults.html()).to.not.contain(noOnlineBookingLinkMessage);
          expect(searchResults.html()).to.contain('href');

          done();
        });
    });
  });

});

describe('Results page error handling', () => {
  describe('when search is not included', () => {
    it('should return a descriptive error messages', (done) => {
      const search = null;
      const errorMessage = messages.emptySearchMessage();

      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          iExpect.homePageEmptyEntry($);
          const errorHeader = $('#content').text();
          expect(errorHeader).to.contain(errorMessage);
          done();
        });
    });
  });
  describe('when search is an empty string', () => {
    const search = '';
    it('should return a descriptive error messages', (done) => {
      const errorMessage = messages.emptySearchMessage();

      chai.request(app)
         .get(resultsRoute)
         .query({ search })
         .end((err, res) => {
           iExpect.htmlWith200Status(err, res);
           const $ = cheerio.load(res.text);

           iExpect.homePageEmptyEntry($);
           const errorHeader = $('#content').text();
           expect(errorHeader).to.contain(errorMessage);
           done();
         });
    });
    it('should not contain a back link', (done) => {
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          expect($('.link-back:first-of-type').length).to.equal(0);
          done();
        });
    });
  });
  describe('when search is some empty spaces', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '   ';
      const errorMessage = messages.emptySearchMessage();

      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          iExpect.homePageEmptyEntry($);
          const errorHeader = $('#content').text();
          expect(errorHeader).to.contain(errorMessage);
          done();
        });
    });
  });
});
