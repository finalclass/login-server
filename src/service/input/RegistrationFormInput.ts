/// <reference path="../../typings/tsd.d.ts"/>

import UserTable = require('../../model/UserTable');
import IUser = require('../../model/interfaces/IUser');
import crypto = require('crypto');

class RegistrationFormInput {

  private _emailErrors:string[];
  private _passwordErrors:string[];
  private _repasswordErrors:string[];

  constructor(private userTable:UserTable, private _email:string, private _password, private _repassword) {
    this.truncate();
  }

  public validate(next:(err?:Error)=>void):void {
    if (!this.email) {
      this.emailErrors.push('Email must be specified');
    }
    if (!this.password) {
      this.passwordErrors.push('Password must be specified');
    }
    if (!this.repassword) {
      this.repasswordErrors.push('Password confirmation must be specified');
    }
    if (!this.isValid) { //if it's not valid now than stop
      next();
      return;
    }
    if (this.email.length < 3) {
      this.emailErrors.push('E-mail address is too short');
    }
    if (this.email.indexOf('@') === -1) {
      this.emailErrors.push('E-mail address should contain "@" character');
    }
    if (this.password.length < 6) {
      this.passwordErrors.push('Password should be at least 6 characters long');
    }
    if (this.repassword !== this.password) {
      this.repasswordErrors.push('Password confirmation differ from the password');
    }
    this.userTable.find({email: this.email}, (err:Error, result:IUser) => {
      if (err) {
        next(err);
        return;
      }
      if (result) {
        this.emailErrors.push('User with given e-mail address has an account');
      }
      next();
    });
  }

  private static md5(text:string):string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  private truncate():void {
    this._emailErrors = [];
    this._passwordErrors = [];
    this._repasswordErrors = [];
  }

  // -------------------------
  // Getters
  // -------------------------
  public get isValid():boolean {
    return this.emailErrors.length === 0
      && this.passwordErrors.length === 0
      && this.repasswordErrors.length === 0;
  }

  public get emailErrors():string[] {
    return this._emailErrors;
  }

  public get passwordErrors():string[] {
    return this._passwordErrors;
  }

  public get repasswordErrors():string[] {
    return this._repasswordErrors;
  }

  public get email():string {
    return this._email;
  }

  public get password():string {
    return this._password;
  }

  public get repassword():string {
    return this._repassword;
  }

}

export = RegistrationFormInput;