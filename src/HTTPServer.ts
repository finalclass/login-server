/// <reference path="typings/tsd.d.ts" />

import logger = require('./logger');
import express = require('express');
import Config = require('./Config');

class HTTPServer {

  private _app:express.Application;

  constructor(private config:Config) {
    this._app = express();
    this.enableStaticFileAccess();
    this.allowCORSFromAll();
  }

  public get app() : express.Application {
    return this._app;
  }

  public run() : void {
    this.app.listen(this.config.port);
    logger.httpServer('listening on port ' + this.config.port);
  }

  private allowCORSFromAll() : void {
    this.app.use(function (req:express.Request, res:express.Response, next:(err?:Error) => void) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  private enableStaticFileAccess() : void {
    this._app.use(express.static(this.config.publicDir));
  }

}

export = HTTPServer;