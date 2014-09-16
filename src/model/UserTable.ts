/// <reference path="../typings/tsd.d.ts"/>

import tryjs = require('try');
import sqlite3 = require('sqlite3');
import tevents = require('tevents');

class UserTable extends tevents.Dispatcher {

  constructor(private db:sqlite3.Database) {
    super();
    this.init();
  }

  private init():void {
    this.db.run('CREATE TABLE IF NOT EXISTS user (' +
        'id INT PRIMARY KEY NOT NULL,' +
        'email TEXT NOT NULL,' +
        'password TEXT NOT NULL)',
      () => this.dispatchEvent(new tevents.Event('initialized')));
  }

}

export = UserTable;