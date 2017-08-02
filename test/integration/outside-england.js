const cheerio = require('cheerio');
const chai = require('chai');
const app = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

const outsideEnglandRoute = `${constants.SITE_ROOT}/outside-england`;

function expectMessageForNotEnglishPostcode(res, message, message2) {
  const $ = cheerio.load(res.text);
  const notEnglishHeader = $('.form-item-wrapper h2').text();
  const resultsParagraph = $('.form-item-wrapper p').text();

  expect(notEnglishHeader).to.contain(message);
  expect(resultsParagraph).to.contain(message2);
}

function makeSearchRequestAndCheckExpectations(postcode, isOutcode, assertions) {
  chai.request(app)
    .get(outsideEnglandRoute)
    .query({ postcode, isOutcode })
    .end(assertions);
}

describe('Out of England', () => {
  it('should return a descriptive message for outcodes', (done) => {
    const postcode = 'EH1';
    const isOutcode = 'true';
    const message = 'This service is for GP surgeries in England';
    const message2 = `The area '${postcode}' is not in England`;

    makeSearchRequestAndCheckExpectations(postcode, isOutcode, (err, res) => {
      expectMessageForNotEnglishPostcode(res, message, message2);
      done();
    });
  });

  it('should return a descriptive message for postcodes', (done) => {
    const postcode = 'EH1 1EN';
    const isOutcode = 'false';
    const message = 'This service is for GP surgeries in England';
    const message2 = `The postcode '${postcode}' is not in England`;

    makeSearchRequestAndCheckExpectations(postcode, isOutcode, (err, res) => {
      expectMessageForNotEnglishPostcode(res, message, message2);
      done();
    });
  });
});
