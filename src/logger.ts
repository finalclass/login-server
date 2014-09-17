/// <reference path="typings/tsd.d.ts" />

import debug = require('debug');

function logger(msg:string):void {
  return logger.log(msg);
}

module logger {
  export var bootstrap = debug('login-server:Bootstrap');
  export var httpServer = debug('login-server:HTTPServer')
  export var log = debug('login-server');
  export var error = debug('login-server:error');
  export var dbQuery= debug('login-server:db-query');
}

export = logger;