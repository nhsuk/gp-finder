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

  it('for a lowercase single string', () => {
    const str = 'clapham';
    const expectedResult = 'Clapham';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a lowercase string that starts with a non-alphanumeric character should leave the first letter alone but downcase the rest', () => {
    const str = 'CLAPHAM (PARK GROUP) PRACTICE';
    const expectedResult = 'Clapham (Park Group) Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a string that has a name with an apostrophe in it', () => {
    const str = 'CLAPHAM  o\'toole practice';
    const expectedResult = 'Clapham O\'Toole Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a string that has a name with an apostrophe at the end', () => {
    const str = 'CLAPHAM bishop\'s practice';
    const expectedResult = 'Clapham Bishop\'s Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a string that has a name with an apostrophe in it that starts with an S', () => {
    const str = 'CLAPHAM  O\'sullivan practice';
    const expectedResult = 'Clapham O\'Sullivan Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a string that has a name with an apostrophe in it that starts with an S and ends with S', () => {
    const str = 'CLAPHAM  O\'sullivan\'s practice';
    const expectedResult = 'Clapham O\'Sullivan\'s Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });

  it('for a string that has a name with an apostrophe in it and and apostrophe at the end', () => {
    const str = 'CLAPHAM  o\'toole\'s practice';
    const expectedResult = 'Clapham O\'Toole\'s Practice';
    const result = properCapitalize(str);

    expect(result).to.be.equal(expectedResult);
  });
});
