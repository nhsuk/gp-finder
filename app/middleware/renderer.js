function results(req, res) {
  res.render('results');
}

function searchForYourGp(req, res) {
  res.render('search-for-your-gp');
}

module.exports = {
  results,
  searchForYourGp,
};
