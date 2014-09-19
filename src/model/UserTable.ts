/// <reference path="../typings/tsd.d.ts"/>

import tryjs = require('try');
import sqlite3 = require('sqlite3');
import logger = require('../logger');
import IUser = require('./interfaces/IUser');
import SQLiteTable = require('sqlite-table');
import crypto = require('crypto');

class UserTable extends SQLiteTable {

  public tableName:string = 'user';

  constructor(db:sqlite3.Database) {
    super(db);
  }

  public init(next?:(err?:Error)=>void):void {
    var query:string = 'CREATE TABLE IF NOT EXISTS user (' +
      'id INTEGER PRIMARY KEY NOT NULL,' +
      'email TEXT NOT NULL,' +
      'password TEXT NOT NULL,' +
      'createdAt INT NOT NULL,' +
      'modifiedAt INT NOT NULL)';

    tryjs
    (() => logger.dbQuery(query))
    (() => this.db.run(query, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => next())
    .catch(next);
  }

  private md5(text:string):string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  private clone(data:any):any {
    var obj:any = {};
    Object.keys(data).forEach((key:string):void => obj[key] = data[key]);
    return obj;
  }

  public insert(data:any, next:(err?:Error)=>void):void {
    data.createdAt = new Date().getTime();
    data.modifiedAt = data.createdAt;
    var dataClone:any = this.clone(data);
    dataClone.password = this.md5(data.password);
    SQLiteTable.prototype.insert.call(this, dataClone, next);
  }

  public update(data:any, next:(err?:Error)=>void):void {
    data.modifiedAt = new Date().getTime();
    SQLiteTable.prototype.update.call(this, data, next);
  }

}

export = UserTable;