/// <reference path="../typings/tsd.d.ts"/>

import HTTPServer = require('../HTTPServer');
import express = require('express');
import RegistrationFormInput = require('./input/RegistrationFormInput');
import UserTable = require('../model/UserTable');
import tryjs = require('try');
import logger = require('../logger');

interface IHandleErrorReturnType {
  (err:Error, ...args:any[]):void;
}

interface IHandleErrorParam {
  (...args:any[]):void;
}

interface IHandleErrorFunction {
  (next:IHandleErrorParam):IHandleErrorReturnType;
}

class UserService {

  constructor(private server:HTTPServer, private userTable:UserTable) {
    this.server.app.post('/register', this.register.bind(this));
    this.server.app.get('/register', UserService.getRegistrationForm.bind(this));
    this.server.app.get('/registration-complete', UserService.getRegistrationComplete.bind(this));
  }

  private getHandleErrorFunction(res:express.Response):IHandleErrorFunction {
    return (next:IHandleErrorParam):IHandleErrorReturnType => {
      return (err:Error, ...args:any[]):void => {
        if (err) {
          logger.error('Internal server error', err);
          res.status(500).render('500-page');
        } else {
          next.apply(this, args);
        }
      };
    };
  }

  private register(req:express.Request, res:express.Response):void {
    var input:RegistrationFormInput =
      new RegistrationFormInput(this.userTable, req.body.email, req.body.password, req.body.repassword);
    var handleError:IHandleErrorFunction = this.getHandleErrorFunction(res);

    input.validate(handleError(():void => {
      if (!input.isValid) {
        res.render('registration-page', input);
      } else {
        this.userTable.insert({
          email: req.body.email,
          password: req.body.password
        }, handleError(():void => {
          res.redirect('/registration-complete');
        }));
      }
    }));
  }

  private static getRegistrationForm(req:express.Request, res:express.Response):void {
    res.render('registration-page');
  }

  private static getRegistrationComplete(req:express.Request, res:express.Response):void {
    res.render('registration-complete-page');
  }
}

export = UserService;