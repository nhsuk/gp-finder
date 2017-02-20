const fs = require('fs');

const sampleResponsesDir = './test/resources';

function getSampleResponse(responseName) {
  return fs.readFileSync(`${sampleResponsesDir}/${responseName}`).toString();
}

module.exports = getSampleResponse;

