function results(req, res) {
  // return results partial if jax request
  if (req.xhr) {
    res.render('includes/results-list', { layout: false });
  } else {
    res.render('results');
  }
}

function searchForYourGp(req, res) {
  res.render('search-for-your-gp');
}

module.exports = {
  results,
  searchForYourGp,
};
