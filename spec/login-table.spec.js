var LoginTable = require('../src/model/LoginTable');
var sqlite3 = require('sqlite3');

describe('login-table', function () {

  var loginTable;
  var db;

  beforeEach(function (next) {
    db = new sqlite3.Database(':memory:');
    loginTable = new LoginTable(db);

    loginTable.init();

    loginTable.once('initialized', function (event) {
      next();
    });
    loginTable.once('error', function (event) {
      console.log(event.data);
      next(event.data);
    });
  });

  it('creates table', function (next) {
    db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="login"', function (err, result) {
      expect(result).toBeDefined();
      next(err);
    });
  });

  it('creates index', function (next) {
    db.get('SELECT name FROM sqlite_master WHERE type="index" AND name="login_to_user_id_idx"', function (err, result) {
      expect(result).not.toBeNull();
      next(err);
    });
  })


});