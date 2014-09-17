var UserTable = require('../src/model/UserTable');
var sqlite3 = require('sqlite3');

describe('user-table', function () {

  var userTable;
  var db;

  beforeEach(function (next) {
    db = new sqlite3.Database(':memory:');
    userTable = new UserTable(db);

    userTable.init();

    userTable.once('initialized', function (event) {
      next();
    });
    userTable.once('error', function (event) {
      console.log(event.data);
      next(event.data);
    });
  });

  it('creates table', function (next) {
    db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="user"', function (err, result) {
      expect(result).toBeDefined();
      next(err);
    });
  });

});