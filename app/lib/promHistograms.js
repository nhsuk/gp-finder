const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;
const esQueryLabelName = require('./constants').promESQueryLabelName;

module.exports = {
  esGetGP: new promClient.Histogram({
    buckets,
    help: 'Duration histogram of Elasticsearch request to get GPs with: query_type of name_and_geo or name_only',
    labelNames: [esQueryLabelName],
    name: 'es_get_gp',
  }),
  postcodesIORequest: new promClient.Histogram({ buckets, help: 'Duration histogram of postcodes.io request', name: 'postcodes_io_request_duration' }),
};
