var LoginService = require('../src/service/LoginService');
var HTTPServer = require('../src/HTTPServer');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');
var tryjs = require('try');

describe('login-service', function () {

  var loginService;
  var server;
  var config = {
    port: 6760,
    publicDir: __dirname + '/../public',
    viewsDir: path.resolve(__dirname, '..', 'views')
  };
  var baseURL = 'http://localhost:' + config.port;

  beforeEach(function (next) {
    server = new HTTPServer(config);
    loginService = new LoginService(server);

    server.run(next);
  });

  afterEach(function () {
    server.server.close();
  });

  it('generates session id', function (next) {
    var options = {
      method: 'get',
      url: baseURL + '/login/id',
      json: true
    };

    request(options, function (error, response, body) {
      expect(body.length).toBeGreaterThan(5);
      next();
    });
  });

  function getLoginForm(errNext, next) {
    request(baseURL + '/login', function (err, response, body) {
      if (err) {
        errNext(err);
      } else {
        next(cheerio.load(body));
      }
    });
  }

  it('login form has email input', function (next) {
    getLoginForm(next, function ($) {
      expect($('input[name="email"]').length).toBeGreaterThan(0);
      next();
    });
  });

  it('has login form with password field', function (next) {
    getLoginForm(next, function ($) {
      expect($('input[name="password"]').length).toBeGreaterThan(0);
      next();
    });
  });

});