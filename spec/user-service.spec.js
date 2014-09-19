var Bootstrap = require('../src/Bootstrap');
var tryjs = require('try');
var request = require('request');
var cheerio = require('cheerio');

describe('user-service', function () {

  var loginServer;
  var config = {
    port: 6770,
    publicDir: __dirname + '/../public',
    viewsDir: __dirname + ' /../views',
    dbFilePath: ':memory:'
  };
  var baseURL = 'http://localhost:' + config.port;

  beforeEach(function (next) {
    loginServer = new Bootstrap(config);
    loginServer.run(next);
  });

  afterEach(function () {
    loginServer.shutDown();
  });

  function getRegistrationForm(errNext, next) {
    request(baseURL + '/register', function (err, response, body) {
      if (err) {
        errNext(err);
      } else {
        next(cheerio.load(body));
      }
    });
  }

  function postRegistration(email, password, repassword, errNext, next) {
    request.post(baseURL + '/register', {
      form: {
        email: email,
        password: password,
        repassword: repassword
      }
    }, function (err, response, body) {
      if (err) {
        errNext(err);
      } else {
        next(cheerio.load(body), body);
      }
    });
  }

  it('registration form has email, password and repassword fields', function (next) {
    getRegistrationForm(next, function ($) {
      expect($('input[name="email"]').length).toBeGreaterThan(0);
      expect($('input[name="password"]').length).toBeGreaterThan(0);
      expect($('input[name="repassword"]').length).toBeGreaterThan(0);
      next();
    });
  });

  it('renders registration form again after failure registration', function (next) {
    postRegistration('test', 'abcww', 'awww', next, function ($) {
      expect($('input[name="email"]').val()).toBe('test');
      expect($('ul.errors').length).toBeGreaterThan(2);
      next();
    });
  });

  it('redners registration-complete-page with login form after successfull registration', function (next) {
    postRegistration('test@test', 'abcdef', 'abcdef', next, function ($, raw) {
      expect(raw.indexOf('Moved Temporarily. Redirecting to /registration-complete')).not.toBe(-1);
      next();
    });
  });

});