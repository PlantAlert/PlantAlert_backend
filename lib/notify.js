/*jshint node: true */
'use strict';

module.exports = function(city) {
  console.log('STARTING to NOTIFY: ' + city.cityName);

  for (var i = 0; i < city.users.length; i++) {
    //Some function that sends calls or pushes notifications goes here instad of console.log.
    console.log(city.users[i].valueOf());
  }
};
