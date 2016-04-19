/* eslint-disable */
// https://github.com/segmentio/nightmare/blob/master/lib%2Fipc.js

/**
 * Module dependencies
 */

var IPC = require('tiny-ipc');
var Emitter = require('events').EventEmitter;
var stringify = require('json-stringify-safe')

/**
 * Export `ipc`
 */

module.exports = ipc;

/**
 * Initialize `ipc`
 */

function ipc(sock) {
  var emitter = new Emitter();
  var emit = emitter.emit;
  // ECONNREFUSED /tmp/nwsock try/catch也没用
  sock = sock || process.env.NW_AUTO_SOCK // fixme
  var ipc = IPC.getClient(sock);

  ipc.on('message', function (data) {
    emit.apply(emitter, JSON.parse(data));
  });

  emitter.emit = function() {
    ipc.broadcastMessage(JSON.stringify(Array.from(arguments)));
  }

  return emitter;
}
