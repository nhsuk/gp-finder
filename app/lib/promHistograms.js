const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;
const esQueryLabelName = require('./constants').promESQueryLabelName;

module.exports = {
  postcodesIORequest: new promClient.Histogram({ name: 'postcodes_io_request_duration', help: 'Duration histogram of postcodes.io request', buckets }),
  esGetGP: new promClient.Histogram({
    name: 'es_get_gp', help: 'Duration histogram of Elasticsearch request to get GPs with: query_type of name_and_geo or name_only', labelNames: [esQueryLabelName], buckets
  }),
};
