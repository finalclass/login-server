/// <reference path="../../typings/tsd.d.ts"/>

import UserTable = require('../../model/UserTable');
import tevents = require('tevents');
import IUser = require('../../model/interfaces/IUser');

class LoginFormInput extends tevents.Dispatcher {

  private emailErrors:string[];
  private passwordErrors:string[];

  constructor(private userTable:UserTable, public email:string, public password:string) {
    super();
    this.validate();
  }

  private validate():void {
    this.emailErrors = [];
    this.passwordErrors = [];

    if (this.email.length < 3) {
      this.emailErrors.push('E-mail address is too short');
    }
    if (this.email.indexOf('@')) {
      this.emailErrors.push('E-mail address should contain "@" character');
    }
    if (this.password.length < 6) {
      this.passwordErrors.push('Password should be at least 6 characters long');
    }

    this.userTable.findByEmail(this.email,
      (err:Error, result:IUser) => {
        if (err) {
          this.dispatchEvent(new tevents.DataEvent('error', err));
        }
        if (!result) {
          this.emailErrors.push('User with given e-mail address and password does not exists')
        } else if (result.password !== this.password) {
          this.passwordErrors.push('Password is not correct');
        }
        this.dispatchEvent(new tevents.Event('validated'));
      });
  }

  public get isValid():boolean {
    return this.emailErrors.length === 0 && this.passwordErrors.length === 0;
  }

}

export = LoginFormInput;