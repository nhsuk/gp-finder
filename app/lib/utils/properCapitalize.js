function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWithSpecialCharacter(str) {
  return str.charAt(0) + str.charAt(1).toUpperCase() + str.slice(2);
}

function capitalizeAllCaps(str) {
  return str.charAt(0) + str.slice(1).toLowerCase();
}

function capitalizeWithSpecialCharacterCaps(str) {
  return str.charAt(0) + str.charAt(1).toUpperCase() + str.slice(2).toLowerCase();
}

function titleize(input) {
  let stringArray = input.split(' ');
  stringArray = stringArray.map((str) => {
    if (str.toUpperCase() === str) {
      if (str.charAt(0).match(/[^a-zA-Z\d]/)) {
        return capitalizeWithSpecialCharacterCaps(str);
      }
      return capitalizeAllCaps(str);
    } else
      if (str.charAt(0).match(/[^a-zA-Z\d]/)) {
        return capitalizeWithSpecialCharacter(str);
      }
    return capitalize(str);
  });

  return stringArray.join(' ');
}

module.exports = titleize;
