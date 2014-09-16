/// <reference path="typings/tsd.d.ts" />

import extend = require('node.extend');

class Config {

  private data:any;
  private argv:{port:number;p:number;env:string};

  constructor() {
    this.argv = require('optimist')
      .usage('node src/ -p 4630 --env production')
      .alias('p', 'port')
      .describe('p', 'Port for the server to listen to')
      .describe('env', 'Environment')
      .argv;
    this.initData();
  }

  private initData() : void {
    var all:any = require('../etc/config');
    if (this.env === 'production') {
      this.data = extend(all.default, all.production);
    } else {
      this.data = extend(all.default);
    }
  }

  public get env() : string {
    return process.env.NODE_ENV || this.argv.env || 'development';
  }

  public get port() : number {
    return this.argv.port || this.data.port;
  }

  public get publicDir() : string {
    return this.data.publicDir;
  }

  public get dbFilePath() : string {
    return this.data.dbFilePath;
  }

}

export = Config;