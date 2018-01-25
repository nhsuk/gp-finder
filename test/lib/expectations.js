const chai = require('chai');

const expect = chai.expect;

function homePageBase($) {
  expect($('.page-title').text().trim()).to.match(/^Book an appointment through GP online services/);
  // expect($('#search').is('input')).is.equal(true);
}

function homePageEmptyEntry($) {
  homePageBase($);
  expect($('title').html()).to.match(/^Please retry - Book an appointment through GP online services/);
  expect($('.form--error .form-item-wrapper > h2').text()).to.contain('You need to enter some text');
}

function homePageInvalidPostcode($) {
  homePageBase($);
  expect($('title').html()).to.match(/^Please retry - Book a GP appointment online/);
  expect($('.form-item-wrapper').text()).to.contain('The postcode');
  expect($('.form-item-wrapper').text()).to.contain('does not exist');
}

function homePage($) {
  homePageBase($);
  expect($('title').html()).to.match(/^What's your GP surgery's name?/);
  // expect($('label[for=search]').text()).to.contain('Surgery or GP name');
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
  homePageInvalidPostcode,
  htmlWith200Status,
};
