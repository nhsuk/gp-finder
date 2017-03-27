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

  it('should return an object containing GP surgeries matching the query', (done) => {
    const search = 'Idle';
    chai.request(app)
      .get(resultsRoute)
      .query({ search })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

        const searchResults = $('.results__item--nearby');
        expect(searchResults.length).to.equal(1);

        expect($('.link-back').each().text()).to.equal('Back');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
        done();
      });
  });

  it('should return a booking link for a surgery that has a booking supplier', (done) => {
    const search = 'Crookes Valley Medical Centre Sheffield';
    chai.request(app)
      .get(resultsRoute)
      .query({ search })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

        const searchResults = $('.results__item--nearby .results__details').first();
        expect(searchResults.html()).to.not.contain(noOnlineBookingLinkMessage);
        expect(searchResults.html()).to.contain('href');

        expect($('.link-back').text()).to.equal('Back');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
        done();
      });
  });

  it('should return no booking link and some info for a surgery that has no booking supplier', (done) => {
    const search = 'Bents Green Surgery Sheffield';
    chai.request(app)
      .get(resultsRoute)
      .query({ search })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

        const searchResults = $('.results__item--nearby .results__details').first();
        expect(searchResults.html()).to.contain(noOnlineBookingLinkMessage);
        expect(searchResults.html()).to.not.contain('href');

        expect($('.link-back').text()).to.equal('Back');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}`);
        done();
      });
  });

  it('should return an object containing GP surgeries matching multiple word queries', (done) => {
    const search = 'Ireland Wood Leeds';
    chai.request(app)
      .get(resultsRoute)
      .query({ search })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`GP surgeries matching '${search}'`);

        const searchResults = $('.results__item--nearby');
        expect(searchResults.length).to.equal(206);

        expect($('.link-back').text()).to.equal('Back');
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
  });

  describe("when search doesn't bring back results", () => {
    it('should return a descriptive error messages', (done) => {
      const search = 'asdasdas';
      const errorMessage = `We can't find a surgery matching '${search}'`;

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
