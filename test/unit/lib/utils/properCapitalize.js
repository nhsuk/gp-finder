const chai = require('chai');
const properCapitalize = require('../../../../app/lib/utils/properCapitalize');

const expect = chai.expect;

describe('Proper capitalize ', () => {
  it('for a lowercase string should capitalize only the first letter', () => {
    const str = 'clapham park group practice';
    const expectedResult = 'Clapham Park Group Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });
  it('for a lowercase string that starts with a non-alphanumeric character should capitalize only the first letter', () => {
    const str = 'clapham (park group) practice';
    const expectedResult = 'Clapham (Park Group) Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });
  it('for an uppercase string should leave the first letter alone and downcase the rest', () => {
    const str = 'CLAPHAM PARK GROUP PRACTICE';
    const expectedResult = 'Clapham Park Group Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });
  it('for a lowercase string that starts with a non-alphanumeric character should leave the first letter alone but downcase the rest', () => {
    const str = 'CLAPHAM (PARK GROUP) PRACTICE';
    const expectedResult = 'Clapham (Park Group) Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });
});
