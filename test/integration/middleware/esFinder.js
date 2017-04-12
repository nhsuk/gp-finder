const Client = require('node-rest-client-promise').Client;
// const chai = require('chai');

// const expect = chai.expect;
const client = new Client();

function getResultHits(res) {
  return res.data && res.data.hits && res.data.hits.hits;
}

function esQuery(index, term) {
  return client.getPromise(`http://es:9200/${index}/_search?q=${term}`).then(getResultHits);
}

xdescribe('es search', () => {
  it('should return results fron doctors', (done) => {
    esQuery('profiles', 'ramdeehul').then(() => {
      done();
    }
    ).catch(done);
  });
});
