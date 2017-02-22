const chai = require('chai');

const expect = chai.expect;

function homePageBase($) {
  expect($('.local-header--title--question').text().trim()).to.match(/^Book an appointment with a GP/);
  expect($('#search').is('input')).is.equal(true);
}

function homePageInvalidEntry($) {
  homePageBase($);
  expect($('label[for=search]').text()).to.contain('Enter a valid surgery name');
}

function homePage($) {
  homePageBase($);
  expect($('label[for=search]').text()).to.contain('Enter a surgery name');
}

function htmlWith200Status(err, res) {
  expect(err).to.equal(null);
  expect(res).to.have.status(200);
  // eslint-disable-next-line no-unused-expressions
  expect(res).to.be.html;
}

module.exports = {
  homePage,
  homePageInvalidEntry,
  htmlWith200Status,
};
