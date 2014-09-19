/// <reference path="../../typings/tsd.d.ts"/>
var crypto = require('crypto');

var RegistrationFormInput = (function () {
    function RegistrationFormInput(userTable, _email, _password, _repassword) {
        this.userTable = userTable;
        this._email = _email;
        this._password = _password;
        this._repassword = _repassword;
        this.truncate();
    }
    RegistrationFormInput.prototype.validate = function (next) {
        var _this = this;
        if (!this.email) {
            this.emailErrors.push('Email must be specified');
        }
        if (!this.password) {
            this.passwordErrors.push('Password must be specified');
        }
        if (!this.repassword) {
            this.repasswordErrors.push('Password confirmation must be specified');
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
        if (this.repassword !== this.password) {
            this.repasswordErrors.push('Password confirmation differ from the password');
        }
        this.userTable.find({ email: this.email }, function (err, result) {
            if (err) {
                next(err);
                return;
            }
            if (result) {
                _this.emailErrors.push('User with given e-mail address has an account');
            }
            next();
        });
    };

    RegistrationFormInput.md5 = function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    };

    RegistrationFormInput.prototype.truncate = function () {
        this._emailErrors = [];
        this._passwordErrors = [];
        this._repasswordErrors = [];
    };

    Object.defineProperty(RegistrationFormInput.prototype, "isValid", {
        // -------------------------
        // Getters
        // -------------------------
        get: function () {
            return this.emailErrors.length === 0 && this.passwordErrors.length === 0 && this.repasswordErrors.length === 0;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "emailErrors", {
        get: function () {
            return this._emailErrors;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "passwordErrors", {
        get: function () {
            return this._passwordErrors;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "repasswordErrors", {
        get: function () {
            return this._repasswordErrors;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(RegistrationFormInput.prototype, "repassword", {
        get: function () {
            return this._repassword;
        },
        enumerable: true,
        configurable: true
    });
    return RegistrationFormInput;
})();

module.exports = RegistrationFormInput;
//# sourceMappingURL=RegistrationFormInput.js.map
