/// <reference path="typings/tsd.d.ts" />

import debug = require('debug');

function logger(msg:string):void {
  return logger.log(msg);
}

module logger {
  export var bootstrap:(msg:string, ...args:any[])=>void = debug('login-server:Bootstrap');
  export var httpServer:(msg:string, ...args:any[])=>void = debug('login-server:HTTPServer')
  export var log:(msg:string, ...args:any[])=>void = debug('login-server');
  export var error:(msg:string, ...args:any[])=>void = debug('login-server:error');
  export var dbQuery:(msg:string, ...args:any[])=>void = debug('login-server:db-query');
}

export = logger;