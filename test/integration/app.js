const chai = require('chai');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const chaiHttp = require('chai-http');

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

  describe('redirection', () => {
    it('default should be find help page', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.redirect;
          expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
          done();
        });
    });

    it('/finder should redirect to find help page', (done) => {
      chai.request(app)
        .get(constants.SITE_ROOT)
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.redirect;
          expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
          done();
        });
    });
  });
  // describe('GP page', () => {
  //   it('should return a GP Page for a valid Org Code', (done) => {
  //     chai.request(app)
  //       .get('/gp-surgeries/A81001')
  //       .end((err, res) => {
  //         expect(err).to.equal(null);
  //         expect(res).to.have.status(200);
  //         expect(res.text).to.contain('GP Page');
  //         done();
  //       });
  //   });
  // });
  // describe('GP page', () => {
  //   it('should return Unknown Practice GP Page for an invalid Org Code', (done) => {
  //     chai.request(app)
  //       .get('/gp-surgeries/12345')
  //       .end((err, res) => {
  //         expect(err).to.equal(null);
  //         expect(res).to.have.status(200);
  //         expect(res.text).to.contain('Unknown Practice');
  //         done();
  //       });
  //   });
  // });
  //
  // describe('Book a GP appointment page', () => {
  //   it('should return a book a GP Appointment Page for a valid Org Code', (done) => {
  //     chai.request(app)
  //       .get('/gp-surgeries/A81001/book-a-gp-appointment')
  //       .end((err, res) => {
  //         expect(err).to.equal(null);
  //         expect(res).to.have.status(200);
  //         expect(res.text).to.contain('Book an appointment');
  //         done();
  //       });
  //   });
  // });
});

