module.exports = function(cityNameWithSpace) {
// ex:   'Saint Louis, MO'   ->   'Saint louis,mo'
// ex:   'Seattle, WA'       ->   'Seattle,wa'

  var clean = cityNameWithSpace.replace(/, /g, ',');
  var firstChar = clean.substring(0, 1);
  var remainderLower = clean.substring(1).toLowerCase();

  return firstChar + remainderLower;
};
