function invalidLocationMessage(location) {
  return `We can't find the location ${location.toLocaleUpperCase()}. Check the location is correct and try again.`;
}

function emptyLocationMessage() {
  return 'You must insert a location to find a surgery.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  invalidLocationMessage,
  emptyLocationMessage,
  technicalProblems,
};
