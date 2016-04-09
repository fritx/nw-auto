/* eslint-disable */
// https://github.com/segmentio/nightmare/blob/master/lib%2Fipc.js

/**
 * Module dependencies
 */

var IPC = require('tiny-ipc');
var Emitter = require('events').EventEmitter;
// var sliced = require('sliced');

/**
 * Export `ipc`
 */

module.exports = ipc;

/**
 * Initialize `ipc`
 */

function ipc(proc, uuid) {
  var emitter = new Emitter();
  var emit = emitter.emit;
  // ECONNREFUSED /tmp/nwsock try/catch也没用
  // uuid = uuid || require('nw.gui').App.argv[0].replace(/^--/, '') // fixme
  uuid = uuid || process.env.NW_AUTO_UUID // fixme
  var ipc = IPC.getClient(`/tmp/nwauto_${uuid}`);

  // no parent
  // if (!proc.send) {
  //   return emitter;
  // }

  // proc.on('message', function(data) {
  ipc.on('message', function (data) {
    // emit.apply(emitter, sliced(data));
    // emit.apply(emitter, [...data]);
    emit.apply(emitter, JSON.parse(data));
  });

  emitter.emit = function() {
    // if(proc.connected){
      // proc.send(sliced(arguments));
      // proc.send(Array.from(arguments));
      ipc.broadcastMessage(JSON.stringify(Array.from(arguments)));
    // }
  }

  return emitter;
}
