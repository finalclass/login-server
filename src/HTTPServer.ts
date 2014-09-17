/// <reference path="typings/tsd.d.ts" />

import logger = require('./logger');
import express = require('express');
import Config = require('./Config');
import http = require('http');
import ect = require('ect');

class HTTPServer {

  private _app:express.Application;
  private _server:http.Server;

  constructor(private config:Config) {
    this._app = express();
    this.enableStaticFileAccess();
    this.allowCORSFromAll();
    this.enableTemplateEngine();
  }

  public get app():express.Application {
    return this._app;
  }

  public get server():http.Server {
    return this._server;
  }

  public run(next:()=>void):void {
    this._server = this.app.listen(this.config.port, ():void => {
      logger.httpServer('listening on port ' + this.config.port);
      next();
    });
  }

  private enableTemplateEngine():void {
    this.app.set('views', this.config.viewsDir);
    this.app.set('view engine', 'ect');
    this.app.engine('ect', ect({
      watch: true,
      root: this.config.viewsDir,
      ext: '.ect'
    }).render);
  }

  private allowCORSFromAll():void {
    this.app.use(function (req:express.Request, res:express.Response, next:(err?:Error) => void) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  private enableStaticFileAccess():void {
    this._app.use(express.static(this.config.publicDir));
  }

}

export = HTTPServer;