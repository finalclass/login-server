var Bootstrap = require('../src/Bootstrap');
var tryjs = require('try');
var request = require('request');
var cheerio = require('cheerio');

describe('login-service', function () {
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

  function postLoginForm(email, password, errNext, next) {
    request.post(baseURL + '/login', {
      form: {
        email: email,
        password: password
      }
    }, function (err, response, body) {
      if (err) {
        errNext(err);
      } else {
        next(cheerio.load(body), body);
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

  it('fills the login after failure', function (next) {
    postLoginForm('test@email.com', 'password', next, function ($) {
      expect($('input[name="email"]').val()).toBe('test@email.com');
      next();
    });
  });

  it('does not fill the password after failure', function (next) {
    postLoginForm('test@email.com', 'password', next, function ($) {
      expect($('input[name="password"]').val()).toBeFalsy();
      next();
    });
  });

  it('redirects after successful login', function (next) {
    var user = {email: 'test@test', password: 'abcdef'};

    tryjs
    (function () {
      loginServer.userTable.insert(user, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function () {
      postLoginForm('test@test', 'abcdef', next, function ($, raw) {
        expect(raw).toBe('Moved Temporarily. Redirecting to /login-complete');
        next();
      });
    });
  })

});