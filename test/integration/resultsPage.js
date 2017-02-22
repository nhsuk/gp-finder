const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const contexts = require('../../app/lib/contexts');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results/`;
const numberOfNearbyResults = constants.numberOfNearbyResults;
const context = contexts.stomachAche.context;

describe('Results page', () => {
  it('should return an object containing up to 10 GP surgeries matching the query by default', (done) => {
    const search = 'Raven';
    chai.request(app)
      .get(resultsRoute)
      .query({ search, context })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        const resultsHeader = $('.results__header').text();
        expect(resultsHeader).to.contain(`List of GP Surgeries for ${search}`);

        const searchResults = $('.results__item--nearby');
        expect(searchResults.length).to.be.greaterThan(0);
        expect(searchResults.length).to.be.lessThan(numberOfNearbyResults - 1);

        expect($('.link-back').text()).to.equal('Back to find your GP');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}?context=${context}`);
        done();
      });
  });
});

describe('Results page error handling', () => {
  describe('when search is not included', () => {
    // TODO: fix 500 when empty message
    it('should return a descriptive error messages', (done) => {
      const search = '';
      chai.request(app)
      .get(resultsRoute)
      .query({ search, context })
      .end((err, res) => {
        // expect(err).to.equal([Error: Internal Server Error]);
        // iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);


        const resultsHeader500 = $('.local-header-white-bg').text();
        expect(resultsHeader500).to.contain('Sorry, we are experiencing technical problems');
        done();
      });
    });
  });

  describe("when search doesn't bring back results", () => {
    xit('should return a descriptive error messages', (done) => {
      const search = 'asdasdasd';
      chai.request(app)
        .get(resultsRoute)
        .query({ search })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          const noResultsHeader = $('.results__header .results__header--none').text();
          expect(noResultsHeader).to.contain(`There are no surgeries matching ${search}`);
          done();
        });
    });
  });
});
