/// <reference path="../typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tryjs = require('try');

var logger = require('../logger');

var SQLiteTable = require('sqlite-table');
var crypto = require('crypto');

var UserTable = (function (_super) {
    __extends(UserTable, _super);
    function UserTable(db) {
        _super.call(this, db);
        this.tableName = 'user';
    }
    UserTable.prototype.init = function (next) {
        var _this = this;
        var query = 'CREATE TABLE IF NOT EXISTS user (' + 'id INTEGER PRIMARY KEY NOT NULL,' + 'email TEXT NOT NULL,' + 'password TEXT NOT NULL,' + 'createdAt INT NOT NULL,' + 'modifiedAt INT NOT NULL)';

        tryjs(function () {
            return logger.dbQuery(query);
        })(function () {
            return _this.db.run(query, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return next();
        }).catch(next);
    };

    UserTable.prototype.md5 = function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    };

    UserTable.prototype.insert = function (data, next) {
        data.createdAt = new Date().getTime();
        data.modifiedAt = data.createdAt;
        data.password = this.md5(data.password);
        SQLiteTable.prototype.insert.call(this, data, next);
    };

    UserTable.prototype.update = function (data, next) {
        data.modifiedAt = new Date().getTime();
        SQLiteTable.prototype.update.call(this, data, next);
    };
    return UserTable;
})(SQLiteTable);

module.exports = UserTable;
//# sourceMappingURL=UserTable.js.map
