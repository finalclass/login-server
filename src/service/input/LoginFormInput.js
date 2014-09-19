/// <reference path="../../typings/tsd.d.ts"/>
var crypto = require('crypto');

var LoginFormInput = (function () {
    function LoginFormInput(userTable, _email, _password) {
        this.userTable = userTable;
        this._email = _email;
        this._password = _password;
        this.truncate();
    }
    LoginFormInput.prototype.truncate = function () {
        this._emailErrors = [];
        this._passwordErrors = [];
    };

    LoginFormInput.md5 = function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    };

    LoginFormInput.prototype.validate = function (next) {
        var _this = this;
        this.truncate();

        if (!this.email) {
            this.emailErrors.push('E-mail must be specified');
        }
        if (!this.password) {
            this.passwordErrors.push('Password must be specified');
        }
        if (!this.isValid) {
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

        this.userTable.find({ email: this.email }, function (err, result) {
            if (err) {
                next(err);
                return;
            }
            if (!result) {
                _this.emailErrors.push('User with given e-mail address and password does not exists');
            } else if (result.password !== LoginFormInput.md5(_this.password)) {
                _this.passwordErrors.push('Password is not correct');
            }
            next();
        });
    };

    Object.defineProperty(LoginFormInput.prototype, "isValid", {
        get: function () {
            return this.emailErrors.length === 0 && this.passwordErrors.length === 0;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(LoginFormInput.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(LoginFormInput.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(LoginFormInput.prototype, "emailErrors", {
        get: function () {
            return this._emailErrors;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(LoginFormInput.prototype, "passwordErrors", {
        get: function () {
            return this._passwordErrors;
        },
        enumerable: true,
        configurable: true
    });
    return LoginFormInput;
})();

module.exports = LoginFormInput;
//# sourceMappingURL=LoginFormInput.js.map
