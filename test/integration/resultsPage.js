// const nock = require('nock');
// const cheerio = require('cheerio');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../../server');
// const constants = require('../../app/lib/constants');
// const messages = require('../../app/lib/messages');
// const getSampleResponse = require('../resources/getSampleResponse');
// const iExpect = require('../lib/expectations');
// const contexts = require('../../app/lib/contexts');
//
// const expect = chai.expect;
//
// chai.use(chaiHttp);
//
// const resultsRoute = `${constants.SITE_ROOT}/results`;
// const numberOfNearbyResults = constants.numberOfNearbyResultsToRequest;
//
// describe('The results page', () => {
//   it('should return 3 nearby results, by default', (done) => {
//     const testLocation = 'any location';
//     // const appResponse = getSampleResponse('data/testLocation.json');
//     // const appResult = JSON.parse(appResponse).result;
//     const context = contexts.stomachAche.context;
//
//     // nock('https://api.postcodes.io')
//     //   .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
//     //   .times(1)
//     //   .reply(200, ls27ueResponse);
//
//     // nock(process.env.API_BASE_URL)
//     //   .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:nearby=${numberOfNearbyResults}`)
//     //   .times(1)
//     //   .reply(200, appResponse);
//
//     chai.request(server)
//       .get(resultsRoute)
//       .query({ location: "location", context })
//       .end((err, res) => {
//         iExpect.htmlWith200Status(err, res);
//         const $ = cheerio.load(res.text);
//
//     expect($('.results__header--nearby').text())
//       .to.equal('Other pharmacies nearby');
//
//     const openResults = $('.results__details-nearest .results__maplink');
//     expect(openResults.length).to.equal(1);
//
//     const nearbyResults = $('.results__item--nearby');
//     expect(nearbyResults.length).to.equal(constants.numberOfNearbyResultsToDisplay);
//
//     const mapLinks = $('.results__maplink');
//     mapLinks.toArray().forEach((link) => {
//       expect($(link).attr('href')).to.have.string('https://maps.google.com');
//     });
//
//     expect($('.link-back').text()).to.equal('Back to find a pharmacy');
//     expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}/find-help?context=${context}`);
//     done();
//     });
//   });
// });
