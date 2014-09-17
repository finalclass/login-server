/// <reference path="../typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tryjs = require('try');

var tevents = require('tevents');
var logger = require('../logger');

var UserTable = (function (_super) {
    __extends(UserTable, _super);
    function UserTable(db) {
        _super.call(this);
        this.db = db;
    }
    UserTable.prototype.init = function () {
        var _this = this;
        var query = 'CREATE TABLE IF NOT EXISTS user (' + 'id INT PRIMARY KEY NOT NULL,' + 'email TEXT NOT NULL,' + 'password TEXT NOT NULL,' + 'createdAt INT NOT NULL,' + 'modifiedAt INT NOT NULL)';

        tryjs(function () {
            return logger.dbQuery(query);
        })(function () {
            return _this.db.run(query, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return _this.dispatchEvent(new tevents.Event('initialized'));
        }).catch(function () {
            return _this.dispatchEvent(new tevents.Event('error'));
        });
    };

    UserTable.prototype.findByEmail = function (email, next) {
        this.db.get('SELECT * FROM user WHERE email=?', email, next);
    };
    return UserTable;
})(tevents.Dispatcher);

module.exports = UserTable;
//# sourceMappingURL=UserTable.js.map
