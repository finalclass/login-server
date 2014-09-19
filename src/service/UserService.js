/// <reference path="../typings/tsd.d.ts"/>
var RegistrationFormInput = require('./input/RegistrationFormInput');

var logger = require('../logger');

var UserService = (function () {
    function UserService(server, userTable) {
        this.server = server;
        this.userTable = userTable;
        this.server.app.post('/register', this.register.bind(this));
        this.server.app.get('/register', UserService.getRegistrationForm.bind(this));
        this.server.app.get('/registration-complete', UserService.getRegistrationComplete.bind(this));
    }
    UserService.prototype.getHandleErrorFunction = function (res) {
        var _this = this;
        return function (next) {
            return function (err) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                if (err) {
                    logger.error('Internal server error', err);
                    res.status(500).render('500-page');
                } else {
                    next.apply(_this, args);
                }
            };
        };
    };

    UserService.prototype.register = function (req, res) {
        var _this = this;
        var input = new RegistrationFormInput(this.userTable, req.body.email, req.body.password, req.body.repassword);
        var handleError = this.getHandleErrorFunction(res);

        input.validate(handleError(function () {
            if (!input.isValid) {
                res.render('registration-page', input);
            } else {
                _this.userTable.insert({
                    email: req.body.email,
                    password: req.body.password
                }, handleError(function () {
                    res.redirect('/registration-complete');
                }));
            }
        }));
    };

    UserService.getRegistrationForm = function (req, res) {
        res.render('registration-page');
    };

    UserService.getRegistrationComplete = function (req, res) {
        res.render('registration-complete-page');
    };
    return UserService;
})();

module.exports = UserService;
//# sourceMappingURL=UserService.js.map
