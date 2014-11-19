/*jshint node: true */
'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);


require('../../server');

var expect = chai.expect;

describe('user functionality', function() {
  var id;
  var jwtToken;
  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });
});

describe('user password tests', function() {
  it('should not let a user have a password without a number', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'testtestT$'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('invalid password');
      done();
    });
  });
});


describe('add a new city', function() {
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test7@example.com', password: 'Password123#'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should add a new city, then add the user to that new city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken})
    .send({cityName: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('cityName');
      expect(res.body.users).to.not.eql([]);
      done();
    });
  });
});

describe('add a user to an existing city', function() {
  var jwtToken;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test8@example.com', password: 'Password123#'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should add a user to an existing city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken})
    .send({cityName: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.users.length).to.eql(2);
      done();
    });
  });
});
