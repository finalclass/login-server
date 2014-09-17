/// <reference path="../../typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tevents = require('tevents');

var LoginFormInput = (function (_super) {
    __extends(LoginFormInput, _super);
    function LoginFormInput(userTable, email, password) {
        _super.call(this);
        this.userTable = userTable;
        this.email = email;
        this.password = password;
        this.validate();
    }
    LoginFormInput.prototype.validate = function () {
        var _this = this;
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

        this.userTable.findByEmail(this.email, function (err, result) {
            if (err) {
                _this.dispatchEvent(new tevents.DataEvent('error', err));
            }
            if (!result) {
                _this.emailErrors.push('User with given e-mail address and password does not exists');
            } else if (result.password !== _this.password) {
                _this.passwordErrors.push('Password is not correct');
            }
            _this.dispatchEvent(new tevents.Event('validated'));
        });
    };

    Object.defineProperty(LoginFormInput.prototype, "isValid", {
        get: function () {
            return this.emailErrors.length === 0 && this.passwordErrors.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    return LoginFormInput;
})(tevents.Dispatcher);

module.exports = LoginFormInput;
//# sourceMappingURL=LoginFormInput.js.map
