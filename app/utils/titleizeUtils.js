function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleize(str) {
  var string_array = str.split(' ');
  string_array = string_array.map(function(str) {
    if(str.charAt(0) == str.charAt(0).toUpperCase()) {
      return str;
    } else if(str.charAt(0).contains('!@#&()–[{}]:;,?/*~$^+=<>\'')) {
        return str.charAt(0) + str.charAt(1).toUpperCase() + str.slice(2);
      } else {
        return capitalize(str);
      }
  });

  return string_array.join(' ');
}

module.exports = titleize;
