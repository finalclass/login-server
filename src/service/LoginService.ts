/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');

class LoginService {

  constructor(private server:HTTPServer) {
    this.server.app.get('/login/id', LoginService.getSessionId.bind(this));
    this.server.app.get('/login/form', LoginService.getLoginForm)
  }

  private static getSessionId(req:express.Request, res:express.Response):void {
    res.status(200).json(Math.floor(Math.random() * 1e14).toString(36));
  }

  private static getLoginForm(req:express.Request, res:express.Response):void {
    res.render('login');
  }

}

export = LoginService;