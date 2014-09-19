/// <reference path="typings/tsd.d.ts" />

import logger = require('./logger');
import express = require('express');
import Config = require('./Config');
import http = require('http');
import ect = require('ect');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var stylus = require('stylus');
var nib = require('nib');


class HTTPServer {

  private _app:express.Application;
  private _server:http.Server;

  constructor(private config:Config) {
    this._app = express();
    this.enableStylus();
    this.enableStaticFileAccess();
    this.allowCORSFromAll();
    this.enableTemplateEngine();
    this.enableBodyParser();
    this.enableCookieParser();
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

  private enableBodyParser():void {
    this.app.use(bodyParser.urlencoded({extended: false}));
  }

  private enableCookieParser():void {
    this.app.use(cookieParser());
  }

  private enableStylus():void {
    this.app.use(stylus.middleware({
      src: __dirname + '/../public/',
      compile: function compile(str, path) {
        return stylus(str)
          .set('filename', path)
          .set('compress', true)
          .use(nib());
      }
    }));
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