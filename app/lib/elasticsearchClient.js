const elasticsearch = require('elasticsearch');
const esHost = require('../../config/config').es.host;

function client() {
  return elasticsearch.Client({ host: esHost });
}

module.exports = client();
