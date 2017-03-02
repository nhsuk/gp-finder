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
  it('should return an object containing up to 10 GP surgeries matching the query by default', (done) => {
    const search = 'Raven';
    chai.request(app)
      .get(resultsRoute)
      .query({ search })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP Surgeries matching '${search}'`);

        const searchResults = $('.results__item--nearby');
        expect(searchResults.length).to.equal(11);

        expect($('.link-back').text()).to.equal('Back to Find your GP Surgery');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
        done();
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
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          iExpect.homePageEmptyEntry($);
          const errorHeader = $('#content').text();
          expect(errorHeader).to.contain(errorMessage);
          done();
        });
    });
  });
  describe('when search is an empty string', () => {
    it('should return a descriptive error messages', (done) => {
      const search = '';
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
    describe('when search is an empty string', () => {
      it('should return a descriptive error messages', (done) => {
         const search = '';
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

  describe("when search doesn't bring back results", () => {
    it('should return a descriptive error messages', (done) => {
      const search = 'asdasdas';
      const errorMessage = `There are no GP surgeries matching '${search}'`;

      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          const noResultsHeader = $('#content').text();
          expect(noResultsHeader).to.contain(errorMessage);

          done();
        });
    });
  });
});
