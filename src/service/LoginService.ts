/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');
import LoginFormInput = require('./input/LoginFormInput');
import UserTable = require('../model/UserTable');
import LoginTable = require('../model/LoginTable');
import IUser = require('../model/interfaces/IUser');
import tryjs = require('try');
import logger = require('../logger');

class LoginService {

  constructor(private server:HTTPServer, private userTable:UserTable, private loginTable:LoginTable) {
    this.server.app.get('/login/id', this.getSessionId.bind(this));
    this.server.app.get('/login/:sessionId', LoginService.setSessionId);
    this.server.app.get('/login', LoginService.getLoginForm);
    this.server.app.post('/login', this.postLoginForm.bind(this));
    this.server.app.get('/login-complete', LoginService.getLoginCompletePage);
  }

  private postLoginForm(req:express.Request, res:express.Response):void {
    var input:LoginFormInput = new LoginFormInput(this.userTable, req.body.email, req.body.password);

    if (!req.cookies.sessionId) {
      req.cookies.sessionId = this.loginTable.generateSessionId();
    }

    tryjs
    (():void => input.validate(tryjs.pause()))
    (tryjs.throwFirstArgument)
    (():void => {
      var resume:()=>void = tryjs.pause();
      if (input.isValid) {
        resume();
      } else {
        res.render('login-page', input);
      }
    })
    (() => this.userTable.find({email: input.email}, tryjs.pause()))
    (tryjs.throwFirstArgument)
    ((user:IUser):void => this.loginTable.login(user.id, req.cookies.sessionId, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (():void => res.redirect('/login-complete'))
    .catch((err:Error):void => {
      logger.error('Internal server error', err);
      res.status(500).render('500-page');
    });
  }

  private static setSessionId(req:express.Request, res:express.Response):void {
    req.cookies.sessionId = req.params.sessionId;
    res.redirect('/login');
  }

  private getSessionId(req:express.Request, res:express.Response):void {
    res.status(200).json(this.loginTable.generateSessionId());
  }

  private static getLoginForm(req:express.Request, res:express.Response):void {
    res.render('login-page');
  }

  private static getLoginCompletePage(req:express.Request, res:express.Response):void {
    res.render('login-complete-page');
  }

}

export = LoginService;