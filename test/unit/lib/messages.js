const messages = require('../../../app/lib/messages');
const chai = require('chai');

const expect = chai.expect;

describe('messages', () => {
  it('should have an error message for when nothing has been entered to search with', () => {
    const message = messages.emptySearchMessage();

    expect(message).to.equal('Search using the name of your surgery or GP.');
  });

  it('should have an error message for technical problems', () => {
    const message = messages.technicalProblems();

    expect(message).to.equal('Sorry, we are experiencing technical problems');
  });
});
