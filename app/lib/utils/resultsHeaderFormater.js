function pluraliseSurgeryQuestion(count) {
  return count === 1 ? 'Is this your surgery?' : 'Which is your surgery?';
}

function pluraliseSurgery(count) {
  return count === 1 ? 'this surgery' : 'these surgeries';
}

module.exports = {
  pluraliseSurgeryQuestion,
  pluraliseSurgery,
};
