var Bootstrap = require('../src/Bootstrap');
var tryjs = require('try');
var request = require('request');

describe('common-use-case', function () {
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

  it('runs', function (next) {
    var sid;
    var jar = request.jar();
    var user = {email: 'test@test', password: 'abcdef'};

    tryjs
    (function () {
      loginServer.userTable.insert(user, tryjs.pause());
    })
    (function () {
      request({url: baseURL + '/login/id', json: true}, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function (response) {
      sid = response.body;
      expect(sid).toBeDefined();
      request({url: baseURL + '/login/' + sid, jar: jar}, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function (response) {
      request.post({url: baseURL + '/login', form: user, jar: jar}, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function (response) {
      expect(response.body).toBe('Moved Temporarily. Redirecting to /login-complete');
      request({url: baseURL + '/login/check/' + sid, jar: jar, json: true}, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function (response) {
      expect(response.body.isLogged).toBeTruthy();
    })
    (function () {
      next();
    })
    .catch(function (err) {
      console.log(err);
      next(err)
    });
  });


});