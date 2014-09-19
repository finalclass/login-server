/// <reference path="../../typings/tsd.d.ts"/>

import UserTable = require('../../model/UserTable');
import IUser = require('../../model/interfaces/IUser');
import crypto = require('crypto');

class LoginFormInput {

  private _emailErrors:string[];
  private _passwordErrors:string[];

  constructor(private userTable:UserTable, private _email:string, private _password:string) {
    this.truncate();
  }

  private truncate() : void {
    this._emailErrors = [];
    this._passwordErrors = [];
  }

  private static md5(text:string) : string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  public validate(next:(err?:Error)=>void):void {
    this.truncate();
    
    if (!this.email) {
      this.emailErrors.push('E-mail must be specified');
    }
    if (!this.password) {
      this.passwordErrors.push('Password must be specified');
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

    this.userTable.find({email: this.email},
      (err:Error, result:IUser) => {
        if (err) {
          next(err);
          return;
        }
        if (!result) {
          this.emailErrors.push('User with given e-mail address and password does not exists');
        } else if (result.password !== LoginFormInput.md5(this.password)) {
          this.passwordErrors.push('Password is not correct');
        }
        next();
      });
  }

  public get isValid():boolean {
    return this.emailErrors.length === 0 && this.passwordErrors.length === 0;
  }

  public get email() : string {
    return this._email;
  }

  public get password() : string {
    return this._password;
  }

  public get emailErrors() : string[] {
    return this._emailErrors;
  }

  public get passwordErrors() : string[] {
    return this._passwordErrors;
  }

}

export = LoginFormInput;