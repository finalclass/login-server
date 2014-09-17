var LoginService = require('../src/service/LoginService');
var HTTPServer = require('../src/HTTPServer');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');

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

  it('sends login form', function (next) {
    request(baseURL + '/login/form', function (err, response, body) {
      if (err) {
        next(err);
      } else {
        var $ = cheerio.load(body);
        console.log($('body').text());
        next();
      }
    });
  });

});