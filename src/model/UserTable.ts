/// <reference path="../typings/tsd.d.ts"/>

import tryjs = require('try');
import sqlite3 = require('sqlite3');
import tevents = require('tevents');
import logger = require('../logger');

class UserTable extends tevents.Dispatcher {

  constructor(private db:sqlite3.Database) {
    super();
  }

  public init():void {
    var query:string = 'CREATE TABLE IF NOT EXISTS user (' +
      'id INT PRIMARY KEY NOT NULL,' +
      'email TEXT NOT NULL,' +
      'password TEXT NOT NULL,' +
      'createdAt INT NOT NULL,' +
      'modifiedAt INT NOT NULL)';

    tryjs
    (() => logger.dbQuery(query))
    (() => this.db.run(query, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => this.dispatchEvent(new tevents.Event('initialized')))
    .catch(() => this.dispatchEvent(new tevents.Event('error')));
  }

}

export = UserTable;