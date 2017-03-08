function regexQuote(str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

module.exports = regexQuote;
