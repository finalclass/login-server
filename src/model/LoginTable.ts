/// <reference path="../typings/tsd.d.ts"/>

import tryjs = require('try');
import sqlite3 = require('sqlite3');
import logger = require('../logger');
import SQLiteTable = require('sqlite-table');
import ILogin = require('./interfaces/ILogin');

class LoginTable extends SQLiteTable {

  public tableName:string = 'login';

  constructor(db:sqlite3.Database) {
    super(db);
  }

  public init(next?:(err?:Error)=>void):void {
    var tableQuery:string = 'CREATE TABLE IF NOT EXISTS login (' +
      'id INTEGER PRIMARY KEY NOT NULL,' +
      'userId INT NOT NULL,' +
      'createdAt INT NOT NULL,' +
      'sessionId TEXT NOT NULL)';
    var userIdIndexQuery:string = 'CREATE INDEX IF NOT EXISTS user_id_idx ON login(userId)';
    var sessionIdIndexQuery:string = 'CREATE INDEX IF NOT EXISTS session_id_idx ON login(sessionId)';

    tryjs
    (() => logger.dbQuery(tableQuery))
    (() => this.db.run(tableQuery, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.dbQuery(userIdIndexQuery))
    (() => this.db.run(userIdIndexQuery, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.dbQuery(sessionIdIndexQuery))
    (() => this.db.run(sessionIdIndexQuery, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => next())
    .catch(next);
  }

  public insert(data:any, next:(err?:Error)=>void):void {
    data.createdAt = new Date().getTime();
    SQLiteTable.prototype.insert.call(this, data, next);
  }

  public login(userId:string, sessionId:string, next:(err?:Error, login?:ILogin)=>void) : void {
    var login:ILogin = {
      userId: userId,
      sessionId: sessionId
    };
    this.insert(login, (err?:Error):void => {
      if (err) {
        next(err);
      } else {
        next(null, login);
      }
    });
  }

  public generateSessionId():string {
    return Math.floor(Math.random() * 1e14).toString(36);
  }

}

export = LoginTable;