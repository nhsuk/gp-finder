function results(req, res) {
  res.render('results');
}

function searchYourGP(req, res) {
  res.render('search-your-gp');
}

module.exports = {
  results,
  searchYourGP,
};
