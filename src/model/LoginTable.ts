/// <reference path="../typings/tsd.d.ts"/>

import tryjs = require('try');
import sqlite3 = require('sqlite3');
import tevents = require('tevents');
import logger = require('../logger');

class LoginTable extends tevents.Dispatcher {

  constructor(private db:sqlite3.Database) {
    super();
  }

  public init():void {
    var tableQuery:string = 'CREATE TABLE IF NOT EXISTS login (' +
      'id INT PRIMARY KEY NOT NULL,' +
      'userId INT NOT NULL,' +
      'cratedAt INT NOT NULL,' +
      'sessionId TEXT NOT NULL)';
    var indexQuery:string = 'CREATE INDEX IF NOT EXISTS222 login_to_user_id_idx ON login(userId)';

    tryjs
    (() => logger.dbQuery(tableQuery))
    (() => this.db.run(tableQuery, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => logger.dbQuery(indexQuery))
    (() => this.db.run(indexQuery, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (() => this.dispatchEvent(new tevents.Event('initialized')))
    .catch((err:Error) => this.dispatchEvent(new tevents.DataEvent('error', err)));
  }

}

export = LoginTable;