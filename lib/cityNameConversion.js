module.exports = function(cityNameWithSpace){

var noSpaces = cityNameWithSpace.replace(/ /g, '');
var firstChar = noSpaces.substring(0,1);
var remainderLower = noSpaces.substring(1).toLowerCase();

// ex:   'Saint Louis, MO'   ->   'Saintlouis,mo'
return firstChar + remainderLower;
};
