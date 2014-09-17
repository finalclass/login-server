/// <reference path="../typings/tsd.d.ts"/>
var LoginService = (function () {
    function LoginService(server) {
        this.server = server;
        this.server.app.get('/session-id', this.getSessionId.bind(this));
    }
    LoginService.prototype.getSessionId = function (req, res) {
        res.json(200, { status: 'ok' });
    };
    return LoginService;
})();

module.exports = LoginService;
//# sourceMappingURL=LoginService.js.map
