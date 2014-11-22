/*jshint node: true */
'use strict';

var mongoose = require('mongoose');
var request = require('superagent');
var notify = require('../lib/notify');
var moment = require('moment');
var zone = require('moment-timezone');

var citySchema = mongoose.Schema({
  cityName: String,
  users: [],
  temp: Number,
  date: String
});

citySchema.methods.notifyFreezing = notify;

citySchema.methods.pullCities = function(done) {
  var _this = this;
  this.model('City').find({}, function(err, data) {
    if (err) {
      return console.log('DB city get all city error.');
    }

    data.forEach(function(city) {

      if (city.users !== null) {

        var weatherForCity = function(city) {
          var tempParse;
          var cityUrl = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + city.cityName + '&cnt=3&units=imperial&APIID=' + process.env.ENVOPENWEATHER + '&mode=json';

          request
            .get(cityUrl).timeout(1000 * 20).end(function(cityData) {

              tempParse = JSON.parse(cityData.text);
              city.temp = (tempParse.list[2].temp.night);
              var dates = (tempParse.list[2].dt);
              city.date = moment.utc().add(2, 'days').zone('-0800').format('dddd, MMMM Do YYYY, hA');
              if (city.temp <= 32) {
                _this.notifyFreezing(city);
                done();
              }
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
