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

describe('existing phone number test', function(){
  it('should not let a user submit a phone number already in database', function(done){
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#', phone: '555-5555'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('phone number in use');
      done();
    });

  });
});


describe('basic notes crud', function() {
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

  // console.log('after before-block, jwt is ' + jwtToken);

  it('should be able to create a note', function(done) {
    this.timeout(5000)
    chai.request('http://localhost:3000')
    .post('/v1/api/notes')
    .set({'jwt': jwtToken})
    .send({noteBody: 'hello world'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      // console.log(res.body);
      expect(res.body).to.have.property('_id')
      id = res.body._id;
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

    // console.log('JWT in get index ' + jwtToken)
  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes/' + id)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/v1/api/notes/' + id)
    .set({jwt: jwtToken})
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/v1/api/notes/' + id)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});
