const messages = require('../../../app/lib/messages');
const chai = require('chai');
const chaiString = require('chai-string');

const expect = chai.expect;

chai.use(chaiString);

describe('messages', () => {
  describe('search information', () => {
    it('should start with a plural message when more than one result', () => {
      const message = messages.searchInfomationMessage(false, undefined, 'Test');
      expect(message).to.startWith('We found these surgeries');
    });

    it('should start with a singular message when only one result', () => {
      const message = messages.searchInfomationMessage(true, undefined, 'Test');
      expect(message).to.startWith('We found this surgery');
    });

    it('should have a postcode message when only a postcode has been passed', () => {
      const message = messages.searchInfomationMessage(false, { isOutcode: false, term: 'HG5 0JL' }, '');
      expect(message).to.equal('We found these surgeries near to \'HG5 0JL\'.');
    });

    it('should have an outcode message when only an outcode has been passed', () => {
      const message = messages.searchInfomationMessage(false, { isOutcode: true, term: 'HG5' }, '');
      expect(message).to.equal('We found these surgeries close to the \'HG5\' area.');
    });

    it('should have an text search message when only text has been passed', () => {
      const message = messages.searchInfomationMessage(false, undefined, 'Beech House');
      expect(message).to.equal('We found these surgeries using \'Beech House\'.');
    });

    it('should have a postcode and text search message when both postcode and text has been passed', () => {
      const message = messages.searchInfomationMessage(false, { isOutcode: false, term: 'HG5 0JL' }, 'Beech House');
      expect(message).to.equal('We found these surgeries near to \'HG5 0JL\' and using \'Beech House\'.');
    });
  });

  describe('search help prompt', () => {
    const searchAgainLink = '<a href=\'/book-a-gp-appointment\'>search again</a>';

    it('should have a postcode message when only a postcode has been passed', () => {
      const message = messages.searchHelpMessage(true, false);

      expect(message).to.equal(`If your surgery is not here, check the postcode you have entered is right and ${searchAgainLink}. You can also search by the name of your GP or surgery.`);
    });

    it('should have a GP name message when only a name has been passed', () => {
      const message = messages.searchHelpMessage(false, true);

      expect(message).to.equal(`If your surgery is not here, check the text you have entered is right and ${searchAgainLink}. You can also search by your postcode.`);
    });

    it('should have a combined message when a postcode and name have been passed', () => {
      const message = messages.searchHelpMessage(true, true);

      expect(message).to.equal(`If your surgery is not here, check the postcode and text you have entered are right and ${searchAgainLink}.`);
    });
  });
});
