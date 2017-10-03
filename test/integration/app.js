const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  describe('default page', () => {
    it('should return a 200 response as html', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;
          done();
        });
    });
  });

  describe('An unknown page', () => {
    it('should return a 404', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/not-known`)
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(404);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.local-header--title--question').text().trim())
            .to.equal('Page not found');
          done();
        });
    });
  });

  describe('The home page', () => {
    it('should contain a generic back link', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/`)
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.link-back').text()).to.equal('');
          iExpect.homePage($);
          done();
        });
    });
    it('should have it\'s page title and h1 to have the same info for SEO reasons', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/`)
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-title').text()).to.equal($('title').text());
          iExpect.homePage($);
          done();
        });
    });
  });
});
