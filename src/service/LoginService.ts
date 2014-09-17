/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');

class LoginService {

  constructor(private server:HTTPServer) {
    this.server.app.get('/session-id', this.getSessionId.bind(this));
  }

  private getSessionId(req:express.Request, res:express.Response):void {
    res.json(200, {status: 'ok'});
  }

}

export = LoginService;