/*jshint node: true */
'use strict';

var City = require('../models/city');

var cityNameConversion = require('../lib/cityNameConversion');

module.exports = function(app) {

  app.post('/api/addcity', function(req, res) {
    var user = req.user;
    var formattedCityName = cityNameConversion(req.body.cityName);

    City.findOne({'cityName': formattedCityName}, function(err, city){

      // if the city is in the collection, add the user to that city
      if (city) {
        city.users.push(user.deviceToken);
        city.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('there was an error');
          }
          return res.status(202).json(data);
        });
      }

      //if the city isn't in the collection, add the city, then add user to that city
      else {
        var newCity = new City();
        newCity.cityName = formattedCityName;
        newCity.users.push(user.deviceToken);
        newCity.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('there was an error');
          }
          return res.status(200).json(data);
        });
      }
    });
  });

  app.post('/api/deletecity', function(req, res) {
    var user = req.user;
    var formattedCityName = cityNameConversion(req.body.cityName);

    City.findOne({'cityName': formattedCityName}, function(err, city){

      // remove the user's device ID from the city
      if (city) {
        for (var i = 0, len = city.users.length; i < len; i++) {
          if (city.users[i] === user.deviceToken) {
            city.users.splice(i, 1);
          }
        }

        city.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('there was an error');
          }
          return res.status(200).json(data);
        });
      }
    });
  });
};
