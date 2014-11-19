/*jshint node:true*/
'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

mongoose.connect(process.env.MONGO_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/plantAlert_development');
app.use(bodyparser.json());
app.set('jwtSecret', process.env.JWT_SECRET || 'changethisoryourplantwillfreeze');

app.use(passport.initialize());

require('./lib/passport')(passport);
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

var citysRouter = express.Router();
citysRouter.use(jwtauth);


require('./routes/users_routes')(app, passport);
require('./routes/citys_routes')(citysRouter);
app.use('/v1', citysRouter);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
