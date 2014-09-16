/// <reference path="typings/tsd.d.ts" />
var logger = require('./logger');
var sqlite3 = require('sqlite3');
var tryjs = require('try');
var Config = require('./Config');
var HTTPServer = require('./HTTPServer');
var UserTable = require('./model/UserTable');

var config = new Config();
var server = new HTTPServer(config);
var db = new sqlite3.Database(config.dbFilePath);
var userTable = new UserTable(db);

tryjs(function () {
    return userTable.once('initialized', tryjs.pause());
})(function () {
    logger('Database initialized');
    server.run();
    logger('Listening on port ' + config.port);
}).catch(function (err) {
    db.close();
    logger.error(err.toString());
});
//# sourceMappingURL=index.js.map
