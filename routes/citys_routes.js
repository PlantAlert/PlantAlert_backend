/*jshint node: true */
'use strict';

var City = require('../models/city');

module.exports = function(app) {

  app.post('/api/addcity', function(req, res) {
    var user = req.user;

    City.findOne({'cityName': req.body.cityName}, function(err, city){

      // if the city is in the collection, add the user to that city
      if (city) {
        city.users.push(user.deviceID);
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
        newCity.cityName = req.body.cityName;
        newCity.users.push(user.deviceID);
        newCity.save(function(err, data) {
          if (err) {
            return res.status(500).send('there was an error');
          }
          return res.status(200).json(data);
        });
      }
    });
  });
};
