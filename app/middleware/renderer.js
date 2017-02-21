function results(req, res) {
  res.render('results');
}

function findHelp(req, res) {
  res.render('find-help');
}

module.exports = {
  results,
  findHelp,
};
