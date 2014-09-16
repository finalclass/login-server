/// <reference path="typings/tsd.d.ts" />
var express = require('express');

var HTTPServer = (function () {
    function HTTPServer(config) {
        this.config = config;
        this._app = express();
        this.enableStaticFileAccess();
        this.allowCORSFromAll();
    }
    Object.defineProperty(HTTPServer.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });

    HTTPServer.prototype.run = function () {
        this.app.listen(this.config.port);
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
