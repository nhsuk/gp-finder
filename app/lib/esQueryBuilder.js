function build(searchTerm) {
  return {
    q: searchTerm,
    size: 30,
  };
}

module.exports = {
  build,
};
