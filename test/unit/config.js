const config = require('../../config/config');
const chai = require('chai');

const expect = chai.expect;

describe('config', () => {
  describe('app', () => {
    it('should return name as gp-finder', () => {
      expect(config.app.name).to.be.equal('gp-finder');
    });
  });

  describe('root level items', () => {
    it('should return env as test during test', () => {
      expect(config.env).to.be.equal('test');
    });

    it('should return default port as 3000', () => {
      expect(config.port).to.be.equal(3000);
    });
  });

  describe('es', () => {
    it('should return es as default host', () => {
      expect(config.es.host).to.be.equal('es');
    });

    it('should return 9200 as default port', () => {
      expect(config.es.port).to.be.equal('9200');
    });
  });
});
