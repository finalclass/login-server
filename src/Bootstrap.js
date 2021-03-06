/// <reference path="typings/tsd.d.ts"/>
var logger = require('./logger');

var sqlite3 = require('sqlite3');
var tryjs = require('try');
var Config = require('./Config');
var HTTPServer = require('./HTTPServer');
var UserTable = require('./model/UserTable');
var LoginTable = require('./model/LoginTable');
var LoginService = require('./service/LoginService');
var UserService = require('./service/UserService');

var Bootstrap = (function () {
    function Bootstrap(config) {
        if (config) {
            this.config = config;
        }
        this.errorHandler = this.errorHandler.bind(this);
        logger.bootstrap('new Bootstrap created');
    }
    Bootstrap.prototype.run = function (next) {
        var _this = this;
        tryjs(function () {
            return logger.bootstrap('run started');
        })(function () {
            return _this.instantiate(tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return logger.bootstrap('classes instantiated');
        })(function () {
            return _this.initDB(tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return logger.bootstrap('database ready');
        })(function () {
            return _this.server.run(tryjs.pause());
        })(function () {
            return logger.bootstrap('server started');
        })(function () {
            return logger.bootstrap('complete');
        })(next).catch(function (err) {
            logger.bootstrap('Error:(');
            _this.errorHandler(err);
            next(err);
        });
    };

    Bootstrap.prototype.shutDown = function () {
        if (this.server && this.server.server) {
            this.server.server.close();
        }
    };

    Bootstrap.prototype.instantiate = function (next) {
        this.config = this.config || new Config();
        this.server = new HTTPServer(this.config);
        this.db = new sqlite3.Database(this.config.dbFilePath);
        this.userTable = new UserTable(this.db);
        this.loginTable = new LoginTable(this.db);
        this.loginService = new LoginService(this.server, this.userTable, this.loginTable);
        this.userService = new UserService(this.server, this.userTable);
        next();
    };

    Bootstrap.prototype.initDB = function (next) {
        var _this = this;
        tryjs(function () {
            _this.userTable.init(tryjs.pause());
            _this.loginTable.init(tryjs.pause());
        })([tryjs.throwFirstArgumentInArray])(function () {
            return next();
        }).catch(next);
    };

    Bootstrap.prototype.errorHandler = function (err) {
        if (this.db) {
            this.db.close();
        }

        if (err) {
            logger.error('bootstrap error', err);
        } else {
            logger.error('Unknown error occurred in Bootstrap');
        }
    };
    return Bootstrap;
})();

module.exports = Bootstrap;
//# sourceMappingURL=Bootstrap.js.map
