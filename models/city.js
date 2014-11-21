/*jshint node: true */
'use strict';

var mongoose = require('mongoose');
var request = require('superagent');
var notify = require('../lib/notify');

var citySchema = mongoose.Schema({
  cityName: String,
  users: []
});


citySchema.methods.notifyFreezing = notify;

citySchema.methods.pullCities = function(done){
  var self = this;
  this.model('City').find({}, function(err, data) {
    if (err) return console.log('DB city get all city error.');

    data.forEach(function(city) {

      if(city.users !== null) {

        var weatherForCity = function(city) {
          var tempParse;
          var temp;
          var cityUrl = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + city.cityName + '&cnt=3&units=imperial&APIID=' + process.env.ENVOPENWEATHER + '&mode=json';

          request     // 1 ms WILL error out!
            .get(cityUrl).timeout(1000 * 20).end(function(cityData) {

              tempParse = JSON.parse(cityData.text);
              temp = (tempParse.list[2].temp.night);
              if (temp <= 32) {
                self.notifyFreezing(city);
                done();
              };
            }).on('error', function(err) {
                console.log('Weather API req in pullCities TIMEOUT: ms was:' + err.timeout);
            });
        };
        weatherForCity(city);
      }
    });
  });
};

module.exports = mongoose.model('City', citySchema);
