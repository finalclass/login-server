/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');
import LoginFormInput = require('./input/LoginFormInput');
import UserTable = require('../model/UserTable');
import LoginTable = require('../model/LoginTable');
import IUser = require('../model/interfaces/IUser');
import ILogin = require('../model/interfaces/ILogin');
import tryjs = require('try');
import logger = require('../logger');

class LoginService {

  constructor(private server:HTTPServer, private userTable:UserTable, private loginTable:LoginTable) {
    this.server.app.get('/login/id', this.getSessionId.bind(this));
    this.server.app.get('/login/:sessionId', LoginService.setSessionId);
    this.server.app.get('/login', LoginService.getLoginForm);
    this.server.app.post('/login', this.postLoginForm.bind(this));
    this.server.app.get('/login/check/:sessionId', this.checkLogin.bind(this));
    this.server.app.get('/login-complete', LoginService.getLoginCompletePage);
  }

  private checkLogin(req:express.Request, res:express.Response):void {
    this.loginTable.find({sessionId: req.params.sessionId}, (err:Error, result:ILogin):void => {
      if (err) {
        res.status(500).json({status: 'error', reason: 'internal_server_error'});
      } else if (!result) {
        res.status(200).json({status: 'ok', isLogged: false});
      } else {
        res.status(200).json({status: 'ok', isLogged: true});
      }
    });
  }

  private postLoginForm(req:express.Request, res:express.Response):void {
    var input:LoginFormInput = new LoginFormInput(this.userTable, req.body.email, req.body.password);
    var sid:string = req.cookies.sessionId || this.loginTable.generateSessionId();
    res.cookie('sessionId', sid);

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
    ((user:IUser):void => this.loginTable.login(user.id, sid, tryjs.pause()))
    (tryjs.throwFirstArgument)
    (():void => res.redirect('/login-complete'))
    .catch((err:Error):void => {
      logger.error('Internal server error', err);
      res.status(500).render('500-page');
    });
  }

  private static setSessionId(req:express.Request, res:express.Response):void {
    res.cookie('sessionId', req.params.sessionId);
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