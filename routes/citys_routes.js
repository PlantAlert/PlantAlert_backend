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

  app.post('/api/deletecity', function(req, res) {
    var user = req.user;

    City.findOne({'cityName': req.body.cityName}, function(err, city){

      // remove the user's device ID from the city
      if (city) {
        for (var i = 0; i < city.users.length; i++) {
          if (city.users[i] === user.deviceID) {
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

      //if there are no more device IDs left for that city, delete that city
      // if (city.users.length === 0) {
        // city.remove({'cityName': req.body.cityName}, function(err) {
        //   var deletedMsg = 'deleted ' + req.body.cityName;
        //   if (err) return res.status(500).send('there was an error');
        //   res.status(200).json({msg: deletedMsg});
        // });
      // }
    });
  });
};
