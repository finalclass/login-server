/// <reference path="typings/tsd.d.ts" />

import logger = require('./logger');
import sqlite3 = require('sqlite3');
import tryjs = require('try');
import Config = require('./Config');
import HTTPServer = require('./HTTPServer');
import UserTable = require('./model/UserTable');

var config:Config = new Config();
var server:HTTPServer = new HTTPServer(config);
var db:sqlite3.Database = new sqlite3.Database(config.dbFilePath);
var userTable:UserTable = new UserTable(db);

tryjs
(():any => userTable.once('initialized', tryjs.pause()))
(():void => {
  logger('Database initialized');
  server.run();
  logger('Listening on port ' + config.port);
})
  .catch((err:Error):void => {
    db.close();
    logger.error(err.toString());
  });