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

    tryjs
    (function () {
      request({url: baseURL + '/login/id', json: true}, tryjs.pause());
    })
    (tryjs.throwFirstArgument)
    (function (response) {
      sid = response.body;
      expect(sid).toBeDefined();
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