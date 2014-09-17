/// <reference path="typings/tsd.d.ts" />
var logger = require('./logger');
var express = require('express');

var ect = require('ect');

var HTTPServer = (function () {
    function HTTPServer(config) {
        this.config = config;
        this._app = express();
        this.enableStaticFileAccess();
        this.allowCORSFromAll();
        this.enableTemplateEngine();
    }
    Object.defineProperty(HTTPServer.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(HTTPServer.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: true,
        configurable: true
    });

    HTTPServer.prototype.run = function (next) {
        var _this = this;
        this._server = this.app.listen(this.config.port, function () {
            logger.httpServer('listening on port ' + _this.config.port);
            next();
        });
    };

    HTTPServer.prototype.enableTemplateEngine = function () {
        this.app.set('views', this.config.viewsDir);
        this.app.set('view engine', 'ect');
        this.app.engine('ect', ect({
            watch: true,
            root: this.config.viewsDir,
            ext: '.ect'
        }).render);
    };

    HTTPServer.prototype.allowCORSFromAll = function () {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    };

    HTTPServer.prototype.enableStaticFileAccess = function () {
        this._app.use(express.static(this.config.publicDir));
    };
    return HTTPServer;
})();

module.exports = HTTPServer;
//# sourceMappingURL=HTTPServer.js.map
