/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');

class LoginService {

  constructor(private server:HTTPServer) {
    this.server.app.get('/login/id', LoginService.getSessionId.bind(this));
    this.server.app.get('/login', LoginService.getLoginForm);
    this.server.app.post('/login', this.postLoginForm);
  }

  private postLoginForm(req:express.Request, res:express.Response):void {
    res.json({
      email: req.body.email,
      password: req.body.password
    });
  }

  private validateLogin(email:string, password:string):void {
    if (email.indexOf('@') === -1) {
      return false;
    }
  }

  private static getSessionId(req:express.Request, res:express.Response):void {
    res.status(200).json(Math.floor(Math.random() * 1e14).toString(36));
  }

  private static getLoginForm(req:express.Request, res:express.Response):void {
    res.render('login');
  }

}

export = LoginService;