const elasticsearch = require('elasticsearch');
const esConfig = require('../../config/config').es;

function client() {
  return elasticsearch.Client({ host: `${esConfig.host}:${esConfig.port}` });
}

module.exports = client();
