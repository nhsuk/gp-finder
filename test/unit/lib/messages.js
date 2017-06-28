const messages = require('../../../app/lib/messages');
const chai = require('chai');

const expect = chai.expect;

describe('messages', () => {
  it('should have an error message for when nothing has been entered to search with', () => {
    const message = messages.emptySearchMessage();

    expect(message).to.equal('Enter the name of your surgery, the name of your GP or a postcode.');
  });

  it('should have an error message for when the postcode is invalid', () => {
    const message = messages.invalidPostcodeMessage();

    expect(message).to.equal('Check you\'re using the right postcode. Or search using the name of your GP or surgery.');
  });

  it('should have an error message for when there is an out of England postcode/outcode', () => {
    const message = messages.notEnglishPostcodeMessage();

    expect(message).to.equal('If you\'re not in England, ask your GP\'s receptionist or visit the surgery website to find out if you can ' +
      'book an appointment online. If you\'ve used the wrong postcode, you can search again.');
  });

  it('should have an error message for technical problems', () => {
    const message = messages.technicalProblems();

    expect(message).to.equal('Sorry, we are experiencing technical problems');
  });
});
