var LoginService = require('../src/service/LoginService');
var HTTPServer = require('../src/HTTPServer');
var request = require('request');

describe('login-service', function () {

  var loginService;

  beforeEach(function (next) {
    loginService = new LoginService()
  });

});