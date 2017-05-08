const chai = require('chai');

const expect = chai.expect;

function homePageBase($) {
  expect($('.local-header--title--question').text().trim()).to.match(/^Book a GP appointment online/);
  expect($('#search').is('input')).is.equal(true);
}

function homePageEmptyEntry($) {
  homePageBase($);
  expect($('label[for=search]').text()).to.contain('You need to enter some text');
}

function homePage($) {
  homePageBase($);
  expect($('label[for=search]').text()).to.contain('Find your GP surgery');
}

function htmlWith200Status(err, res) {
  expect(err).to.equal(null);
  expect(res).to.have.status(200);
  // eslint-disable-next-line no-unused-expressions
  expect(res).to.be.html;
}

module.exports = {
  homePage,
  homePageEmptyEntry,
  htmlWith200Status,
};
