/// <reference path="typings/tsd.d.ts" />
var debug = require('debug');

function logger(msg) {
    return logger.log(msg);
}

var logger;
(function (logger) {
    logger.bootstrap = debug('login-server:Bootstrap');
    logger.httpServer = debug('login-server:HTTPServer');
    logger.log = debug('login-server');
    logger.error = debug('login-server:error');
    logger.dbQuery = debug('login-server:db-query');
})(logger || (logger = {}));

module.exports = logger;
//# sourceMappingURL=logger.js.map
