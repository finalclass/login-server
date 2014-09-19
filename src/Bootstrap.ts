/// <reference path="typings/tsd.d.ts"/>

import logger = require('./logger');
import tevents = require('tevents');
import sqlite3 = require('sqlite3');
import tryjs = require('try');
import Config = require('./Config');
import HTTPServer = require('./HTTPServer');
import UserTable = require('./model/UserTable');
import LoginTable = require('./model/LoginTable');
import LoginService = require('./service/LoginService');
import UserService = require('./service/UserService');

class Bootstrap {
  private config:Config;
  private server:HTTPServer;
  private db:sqlite3.Database;
  private userTable:UserTable;
  private loginTable:LoginTable;
  private loginService:LoginService;
  private userService:UserService;

  constructor(config?:Config) {
    if (config) {
      this.config = config;
    }
    this.errorHandler = this.errorHandler.bind(this);
    logger.bootstrap('new Bootstrap created');
  }

  public run(next:(err:Error)=>void):void {
    tryjs
    (() => logger.bootstrap('run started'))
    (() => this.instantiate(tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.bootstrap('classes instantiated'))
    (() => this.initDB(tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.bootstrap('database ready'))
    (() => this.server.run(tryjs.pause()))
    (() => logger.bootstrap('server started'))
    (() => logger.bootstrap('complete'))
    (next)
    .catch((err:Error) => {
      logger.bootstrap('Error:(');
      this.errorHandler(err);
      next(err);
    });
  }

  public shutDown():void {
    if (this.server && this.server.server) {
      this.server.server.close();
    }
  }

  private instantiate(next:(err?:Error)=>void):void {
    this.config = this.config || new Config();
    this.server = new HTTPServer(this.config);
    this.db = new sqlite3.Database(this.config.dbFilePath);
    this.userTable = new UserTable(this.db);
    this.loginTable = new LoginTable(this.db);
    this.loginService = new LoginService(this.server, this.userTable, this.loginTable);
    this.userService = new UserService(this.server, this.userTable);
    next();
  }

  private initDB(next:(err?:Error)=>void):void {
    tryjs
    (() => {
      this.userTable.init(tryjs.pause());
      this.loginTable.init(tryjs.pause());
    })
    ([tryjs.throwFirstArgumentInArray])
    (() => next())
    .catch(next);
  }

  private errorHandler(err:any):void {
    if (this.db) {
      this.db.close();
    }
    
    if (err) {
      logger.error('bootstrap error', err);
    } else {
      logger.error('Unknown error occurred in Bootstrap');
    }
  }

}

export = Bootstrap;