const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const contexts = require('../../app/lib/contexts');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  describe('security headers', () => {
    it('should be returned for a valid request', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
          expect(res).to.have.header('X-Frame-Options', 'DENY');
          expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
          expect(res).to.have.header('X-Download-Options', 'noopen');
          expect(res).to.not.have.header('X-Powered-By');
          done();
        });
    });
  });

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
    describe('with a context of stomach ache', () => {
      it('should contain a back link specific for the context', (done) => {
        chai.request(app)
        .get(`${constants.SITE_ROOT}/`)
        .query({ context: contexts.stomachAche.context })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.link-back').text()).to.equal(contexts.stomachAche.text);
          iExpect.homePage($);
          done();
        });
      });
    });

    describe('with no context', () => {
      it('should contain a generic back link', (done) => {
        chai.request(app)
          .get(`${constants.SITE_ROOT}/`)
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);

            const $ = cheerio.load(res.text);

            expect($('.link-back').text()).to.equal('Back');
            iExpect.homePage($);
            done();
          });
      });
    });

    describe('with an unknown context', () => {
      it('should contain a generic back link', (done) => {
        chai.request(app)
          .get(`${constants.SITE_ROOT}/`)
          .query({ context: 'unknown' })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);

            const $ = cheerio.load(res.text);

            expect($('.link-back').text()).to.equal('Back');
            iExpect.homePage($);
            done();
          });
      });
    });
  });
});

