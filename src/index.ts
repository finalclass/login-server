/// <reference path="typings/tsd.d.ts" />

var debug = require('debug')('login-server');

import sqlite3 = require('sqlite3');
import tryjs = require('try');
import Config = require('./Config');
import HTTPServer = require('./HTTPServer');
import UserTable = require('./model/UserTable');

var config:Config = new Config();
var server:HTTPServer = new HTTPServer(config);
var db:sqlite3.Database = new sqlite3.Database(config.dbFilePath);
var userTable:UserTable = new UserTable(db);

tryjs(():any => userTable.on('initialized', tryjs.pause()))
(():void => {
  debug('Database initialized');
  server.run();
  debug('Listening on port ' + config.port);
})
.catch((err:Error):void => console.log(err));