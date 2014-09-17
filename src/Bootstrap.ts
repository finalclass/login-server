/// <reference path="typings/tsd.d.ts"/>

import logger = require('./logger');
import tevents = require('tevents');
import sqlite3 = require('sqlite3');
import tryjs = require('try');
import Config = require('./Config');
import HTTPServer = require('./HTTPServer');
import UserTable = require('./model/UserTable');
import LoginTable = require('./model/LoginTable');

class Bootstrap {
  private config:Config;
  private server:HTTPServer;
  private db:sqlite3.Database;
  private userTable:UserTable;
  private loginTable:LoginTable;

  constructor() {
    this.errorHandler = this.errorHandler.bind(this);
    logger.bootstrap('new Bootstrap created');
  }

  public run():void {
    tryjs
    (() => logger.bootstrap('run started'))
    (() => this.instantiate(tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.bootstrap('classes instantiated'))
    (() => this.initDB(tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.bootstrap('database ready'))
    (() => this.server.run())
    (() => logger.bootstrap('server started'))
    (() => logger.bootstrap('complete'))
    .catch((err:Error) => {
      logger.bootstrap('Error:(')
      this.errorHandler(err);
    });
  }

  private instantiate(next:(err?:Error)=>void):void {
    this.config = new Config();
    this.server = new HTTPServer(this.config);
    this.db = new sqlite3.Database(this.config.dbFilePath);
    this.userTable = new UserTable(this.db);
    this.loginTable = new LoginTable(this.db);
    next();
  }

  private initDB(next:(err?:Error)=>void):void {
    this.userTable.on('error', this.errorHandler);
    this.loginTable.on('error', this.errorHandler);

    this.userTable.init();
    this.loginTable.init();

    tryjs
    (():void => {
      this.userTable.once('initialized', tryjs.pause());
      this.loginTable.once('initialized', tryjs.pause());
    })
    ((event:tevents.Event) => next())
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