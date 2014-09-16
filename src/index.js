/// <reference path="typings/tsd.d.ts" />
var debug = require('debug')('login-server');

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
    return userTable.on('initialized', tryjs.pause());
})(function () {
    debug('Database initialized');
    server.run();
    debug('Listening on port ' + config.port);
}).catch(function (err) {
    return console.log(err);
});
//# sourceMappingURL=index.js.map
