/// <reference path="../typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tevents = require('tevents');

var UserTable = (function (_super) {
    __extends(UserTable, _super);
    function UserTable(db) {
        _super.call(this);
        this.db = db;
        this.init();
    }
    UserTable.prototype.init = function () {
        var _this = this;
        this.db.run('CREATE TABLE IF NOT EXISTS user (' + 'id INT PRIMARY KEY NOT NULL,' + 'email TEXT NOT NULL,' + 'password TEXT NOT NULL)', function () {
            return _this.dispatchEvent(new tevents.Event('initialized'));
        });
    };
    return UserTable;
})(tevents.Dispatcher);

module.exports = UserTable;
//# sourceMappingURL=UserTable.js.map
