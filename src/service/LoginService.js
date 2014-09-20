/// <reference path="../typings/tsd.d.ts"/>
var LoginFormInput = require('./input/LoginFormInput');

var tryjs = require('try');
var logger = require('../logger');

var LoginService = (function () {
    function LoginService(server, userTable, loginTable) {
        this.server = server;
        this.userTable = userTable;
        this.loginTable = loginTable;
        this.server.app.get('/login/id', this.getSessionId.bind(this));
        this.server.app.get('/login/:sessionId', LoginService.setSessionId);
        this.server.app.get('/login', LoginService.getLoginForm);
        this.server.app.post('/login', this.postLoginForm.bind(this));
        this.server.app.get('/login/check/:sessionId', this.checkLogin.bind(this));
        this.server.app.get('/login-complete', LoginService.getLoginCompletePage);
    }
    LoginService.prototype.checkLogin = function (req, res) {
        this.loginTable.find({ sessionId: req.params.sessionId }, function (err, result) {
            if (err) {
                res.status(500).json({ status: 'error', reason: 'internal_server_error' });
            } else if (!result) {
                res.status(200).json({ status: 'ok', isLogged: false });
            } else {
                res.status(200).json({ status: 'ok', isLogged: true });
            }
        });
    };

    LoginService.prototype.postLoginForm = function (req, res) {
        var _this = this;
        var input = new LoginFormInput(this.userTable, req.body.email, req.body.password);
        var sid = req.cookies.sessionId || this.loginTable.generateSessionId();
        res.cookie('sessionId', sid);

        tryjs(function () {
            return input.validate(tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            var resume = tryjs.pause();
            if (input.isValid) {
                resume();
            } else {
                res.render('login-page', input);
            }
        })(function () {
            return _this.userTable.find({ email: input.email }, tryjs.pause());
        })(tryjs.throwFirstArgument)(function (user) {
            return _this.loginTable.login(user.id, sid, tryjs.pause());
        })(tryjs.throwFirstArgument)(function () {
            return res.redirect('/login-complete');
        }).catch(function (err) {
            logger.error('Internal server error', err);
            res.status(500).render('500-page');
        });
    };

    LoginService.setSessionId = function (req, res) {
        res.cookie('sessionId', req.params.sessionId);
        res.redirect('/login');
    };

    LoginService.prototype.getSessionId = function (req, res) {
        res.status(200).json(this.loginTable.generateSessionId());
    };

    LoginService.getLoginForm = function (req, res) {
        res.render('login-page');
    };

    LoginService.getLoginCompletePage = function (req, res) {
        res.render('login-complete-page');
    };
    return LoginService;
})();

module.exports = LoginService;
//# sourceMappingURL=LoginService.js.map
