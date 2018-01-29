const chai = require('chai');
const parseSearch = require('../../../../app/lib/utils/parseSearch');

const expect = chai.expect;

describe('parseSearch', () => {
  it('no postcode should return populated search term', () => {
    const result = parseSearch.getSearchTerms('Beech House Surgery');
    expect(result.search).to.be.equal('Beech House Surgery');
    expect(result.postcode).to.equal(undefined);
  });
  it('text with postcode should ignore postcode', () => {
    const result = parseSearch.getSearchTerms('HG5 0JL Beech House Surgery');
    expect(result.search).to.be.equal('HG5 0JL Beech House Surgery');
    expect(result.postcode).to.equal(undefined);
  });
  it('postcode with spaces should return populated postcode', () => {
    const result = parseSearch.getSearchTerms('HG5 0JL');
    expect(result.postcode).to.be.equal('HG50JL');
    expect(result.search).to.be.equal(undefined);
  });
  it('postcode without space should return populated postcode', () => {
    const result = parseSearch.getSearchTerms('HG50JL');
    expect(result.postcode).to.be.equal('HG50JL');
    expect(result.search).to.be.equal(undefined);
  });
  it('outcode should return populated postcode', () => {
    const result = parseSearch.getSearchTerms('HG5');
    expect(result.postcode).to.be.equal('HG5');
    expect(result.search).to.be.equal(undefined);
  });
  it('outcode with spaces should return populated postcode', () => {
    const result = parseSearch.getSearchTerms('HG 5');
    expect(result.postcode).to.be.equal('HG5');
    expect(result.search).to.be.equal(undefined);
  });
});
