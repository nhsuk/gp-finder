const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Cache-control headers', () => {
  it('should set cache-control header to 60 seconds for valid page', (done) => {
    chai.request(app)
      .get(`${constants.SITE_ROOT}`)
      .end((err, res) => {
        expect(res).to.have.header('Cache-Control', 'public, max-age=60');
        done();
      });
  });

  it('should not set cache-control for page not found', (done) => {
    chai.request(app)
      .get(`${constants.SITE_ROOT}/invalid-page`)
      .end((err, res) => {
        expect(res).to.not.have.header('Cache-Control');
        done();
      });
  });
});
