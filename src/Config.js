/// <reference path="typings/tsd.d.ts" />
var extend = require('node.extend');

var Config = (function () {
    function Config() {
        this.argv = require('optimist').usage('node src/ -p 4630 --env production').alias('p', 'port').describe('p', 'Port for the server to listen to').describe('env', 'Environment').argv;
        this.initData();
    }
    Config.prototype.initData = function () {
        var all = require('../etc/config');
        if (this.env === 'production') {
            this.data = extend(all.default, all.production);
        } else {
            this.data = extend(all.default);
        }
    };

    Object.defineProperty(Config.prototype, "env", {
        get: function () {
            return process.env.NODE_ENV || this.argv.env || 'development';
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Config.prototype, "port", {
        get: function () {
            return this.argv.port || this.data.port;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Config.prototype, "publicDir", {
        get: function () {
            return this.data.publicDir;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Config.prototype, "dbFilePath", {
        get: function () {
            return this.data.dbFilePath;
        },
        enumerable: true,
        configurable: true
    });
    return Config;
})();

module.exports = Config;
//# sourceMappingURL=Config.js.map
