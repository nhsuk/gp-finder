const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;

function getSpy(spyFor, expectations) {
  const spy = sinon.spy(expectations);
  spy.spyFor = spyFor;
  return spy;
}

function expectCalledOnce(spy) {
  expect(spy.calledOnce)
    .to.equal(true, `Should have called ${spy.spyFor} once`);
}

function expectNotCalled(spy) {
  expect(spy.notCalled)
    .to.equal(true, `Should not have called ${spy.spyFor}`);
}

function getNextSpy(expectations) {
  return getSpy('next', expectations);
}

function getNextExpectations(expectations) {
  const expectNoError = (err) => {
    expect(err).to.be.equal(undefined, 'Error passed to next.');
  };
  return (err) => {
    expectNoError(err);
    expectations();
  };
}

function getMock(methodName, expectations) {
  const mock = {};
  mock[methodName] = getSpy(methodName, expectations);
  return mock;
}

module.exports = {
  getSpy,
  getNextSpy,
  getNextExpectations,
  expectNotCalled,
  expectCalledOnce,
  getMock
};
