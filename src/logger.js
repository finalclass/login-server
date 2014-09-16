/// <reference path="typings/tsd.d.ts" />
var debug = require('debug');

function logger(msg) {
    return logger.log(msg);
}

var logger;
(function (logger) {
    logger.log = debug('login-server');
    logger.error = debug('login-server:error');
})(logger || (logger = {}));

module.exports = logger;
//# sourceMappingURL=logger.js.map
