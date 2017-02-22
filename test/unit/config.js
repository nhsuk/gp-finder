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

  describe('mongodb', () => {
    it('should return gps for collection', () => {
      expect(config.mongodb.collection).to.be.equal('gps');
    });

    it('should return a correct connection string', () => {
      const defaultHost = 'mongo';
      const defaultPort = '27017';
      const defaultDb = 'profiles';

      expect(config.mongodb.connectionString)
        .to.be.equal(`mongodb://${defaultHost}:${defaultPort}/${defaultDb}`);
    });
  });
});
