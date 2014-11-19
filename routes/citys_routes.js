/*jshint node: true */
'use strict';

var City = require('../models/city');

module.exports = function(app) {

  app.post('/api/addcity', function(req, res) {

    var user = req.user;

//VERSION 1 - THE MAKE A NEW CITY BLOCK PASSES TESTS; EXISTING CITY MAKES A NEW CITY WITH NO CITYNAME AND A DIFFERENT CITY ID.

 City.findOne({'cityName': req.body.cityName}, function(err, city){

      // if the city is in the collection, add the user to that city
      console.log('the city is' + city);
      if (city !== null) {
        city.users.push(user._id);
        city.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('there was an error');
          }
          return res.status(202).json(data);
            // return res.status(200).send('Added ' + user.email + ' to '+ city.cityName);
        });
      }

      //if the city isn't in the collection, add the city, then add user to that city
      var newCity = new City();
      newCity.cityName = req.body.cityName;
      newCity.users.push(user._id);
      newCity.save(function(err, data) {
        if (err) {
          return res.status(500).send('there was an error');
        }
        return res.status(200).json(data);
      });
    });
//END VERSION 1 =====================


//VERSION 2 - TWO DIFFERENT IF BLOCKS:GIVES THIS ERROR: ================
//Fatal error: expected {} to have a property '_id'

    // if ((City.findOne({'cityName': req.body.cityName})) == null) {
    //   var newCity = new City();
    //   newCity.cityName = req.body.cityName;
    //   newCity.users.push(user._id);
    //   newCity.save(function(err, data) {
    //     if (err) {
    //       return res.status(500).send('there was an error');
    //     }
    //     return res.status(200).json(data);
    //   });
    // }

    // if ((City.findOne({'cityName': req.body.cityName})) !== null) {
    //   console.log('the city is' + city);
    //   city.users.push(user._id);
    //   city.save(function(err, data) {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).send('there was an error');
    //     }
    //     return res.status(202).json(data);
    //       // return res.status(200).send('Added ' + user.email + ' to '+ city.cityName);
    //   });
    // }
//END VERSION 3 =========================

  });
};
