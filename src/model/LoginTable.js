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

var LoginTable = (function (_super) {
    __extends(LoginTable, _super);
    function LoginTable(db) {
        _super.call(this);
        this.db = db;
    }
    LoginTable.prototype.init = function () {
        var _this = this;
        var tableQuery = 'CREATE TABLE IF NOT EXISTS login (' + 'id INT PRIMARY KEY NOT NULL,' + 'userId INT NOT NULL,' + 'cratedAt INT NOT NULL,' + 'sessionId TEXT NOT NULL)';
        var indexQuery = 'CREATE INDEX IF NOT EXISTS222 login_to_user_id_idx ON login(userId)';

        tryjs(function () {
            return logger.dbQuery(tableQuery);
        })(function () {
            return _this.db.run(tableQuery, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return logger.dbQuery(indexQuery);
        })(function () {
            return _this.db.run(indexQuery, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return _this.dispatchEvent(new tevents.Event('initialized'));
        }).catch(function (err) {
            return _this.dispatchEvent(new tevents.DataEvent('error', err));
        });
    };
    return LoginTable;
})(tevents.Dispatcher);

module.exports = LoginTable;
//# sourceMappingURL=LoginTable.js.map
