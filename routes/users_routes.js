/*jshint node: true */
'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function (app, passport) {
  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({'jwt': req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function (req, res) {
    User.findOne({'email': req.body.email}, function(err, user, phone) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');

      //check to make sure their password only has letters, numbers, and special characters, and is 8 characters or longer
      if (req.body.password == req.body.email) return res.status(500).send('password and user cannot be the same');
      var passwordTest = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20}/;
      if (!passwordTest.test(req.body.password)) return res.status(500).send('invalid password');

      //if their password meets the above criteria, create a new user and return a JWT
      var newUser = new User();
      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      newUser.phone = req.body.phone;
      newUser.deviceToken = req.body.deviceToken;
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({'jwt': newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};
