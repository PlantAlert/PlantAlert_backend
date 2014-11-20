module.exports = function(cityNameWithSpace){
// ex:   'Saint Louis, MO'   ->   'Saint louis,mo'
// ex:   'Seattle, WA'       ->   'Seattle,wa'

var clean = cityNameWithSpace.replace(/, /g, ',');
var firstChar = clean.substring(0,1);
var remainderLower = clean.substring(1).toLowerCase();

return firstChar + remainderLower;
};

// // cityNameConversion CONSOLE TEST, put this in server.js and run
// // outputs to command line and shows expected output is correct
// // *************************
// console.log('convert Saint Louis, MO: ' + require('./lib/cityNameConversion')('Saint Louis, MO'));
// // Saint louis,mo
// console.log('convert San Francisco, CA: ' + require('./lib/cityNameConversion')('San Francisco, CA'));
// // San francisco,ca
// // *************************
// VERIFIED.
