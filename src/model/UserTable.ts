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
    this.db.run('CREATE TABLE user (id int primary key not null)', ():void => {
      this.dispatchEvent(new tevents.Event('initialized'));
    });
  }

}

export = UserTable;