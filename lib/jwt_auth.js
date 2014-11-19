/*jshint node: true */
'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function(secret) {
  return function(req, res, next) {
    var token = req.headers.jwt || req.body.jwt;

    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch(err) {
      console.log(err);
      res.status(403).send('access denied');
      // return res.status(403).send('access denied');
    }

    //ADD TOKEN EXPIRATION LATER IF THE iOS TEAM HAS TIME
    //expire the token if it's more than 24 hours (84600000 ms) old
    // if ((Date.now() - decoded.lastLogin) > 86400000) return res.status(403).send('Session expired. Please log in again.');

    User.findOne({_id: decoded.iss}, function(err, user) {
      if (err) return res.status(403).send('access denied');
      if (!user) return res.status(403).send('access denied');

      req.user = user;
      next();
    });
  };
};
