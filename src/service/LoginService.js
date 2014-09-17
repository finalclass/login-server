/// <reference path="../typings/tsd.d.ts"/>
var LoginService = (function () {
    function LoginService(server) {
        this.server = server;
        this.server.app.get('/login/id', LoginService.getSessionId.bind(this));
        this.server.app.get('/login', LoginService.getLoginForm);
        this.server.app.post('/login', this.postLoginForm);
    }
    LoginService.prototype.postLoginForm = function (req, res) {
        res.json({
            email: req.body.email,
            password: req.body.password
        });
    };

    LoginService.prototype.validateLogin = function (email, password) {
        if (email.indexOf('@') === -1) {
            return false;
        }
    };

    LoginService.getSessionId = function (req, res) {
        res.status(200).json(Math.floor(Math.random() * 1e14).toString(36));
    };

    LoginService.getLoginForm = function (req, res) {
        res.render('login');
    };
    return LoginService;
})();

module.exports = LoginService;
//# sourceMappingURL=LoginService.js.map
