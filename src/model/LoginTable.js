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

var LoginTable = (function (_super) {
    __extends(LoginTable, _super);
    function LoginTable(db) {
        _super.call(this, db);
        this.tableName = 'login';
    }
    LoginTable.prototype.init = function (next) {
        var _this = this;
        var tableQuery = 'CREATE TABLE IF NOT EXISTS login (' + 'id INTEGER PRIMARY KEY NOT NULL,' + 'userId INT NOT NULL,' + 'createdAt INT NOT NULL,' + 'sessionId TEXT NOT NULL)';
        var userIdIndexQuery = 'CREATE INDEX IF NOT EXISTS user_id_idx ON login(userId)';
        var sessionIdIndexQuery = 'CREATE INDEX IF NOT EXISTS session_id_idx ON login(sessionId)';

        tryjs(function () {
            return logger.dbQuery(tableQuery);
        })(function () {
            return _this.db.run(tableQuery, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return logger.dbQuery(userIdIndexQuery);
        })(function () {
            return _this.db.run(userIdIndexQuery, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return logger.dbQuery(sessionIdIndexQuery);
        })(function () {
            return _this.db.run(sessionIdIndexQuery, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return next();
        }).catch(next);
    };

    LoginTable.prototype.insert = function (data, next) {
        data.createdAt = new Date().getTime();
        SQLiteTable.prototype.insert.call(this, data, next);
    };

    LoginTable.prototype.login = function (userId, sessionId, next) {
        var login = {
            userId: userId,
            sessionId: sessionId
        };
        this.insert(login, function (err) {
            if (err) {
                next(err);
            } else {
                next(null, login);
            }
        });
    };

    LoginTable.prototype.generateSessionId = function () {
        return Math.floor(Math.random() * 1e14).toString(36);
    };
    return LoginTable;
})(SQLiteTable);

module.exports = LoginTable;
//# sourceMappingURL=LoginTable.js.map
