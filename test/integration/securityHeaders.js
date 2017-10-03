const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');

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
          expect(res).to.have.header('Strict-Transport-Security', 'max-age=15552000');
          expect(res).to.not.have.header('X-Powered-By');
          done();
        });
    });
  });
});
