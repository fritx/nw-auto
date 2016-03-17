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

function ipc(process) {
  var emitter = new Emitter();
  var emit = emitter.emit;
  var ipc = IPC.getClient('/tmp/nwsock');

  // no parent
  // if (!process.send) {
  //   return emitter;
  // }

  // process.on('message', function(data) {
  ipc.on('message', function (data) {
    // emit.apply(emitter, sliced(data));
    // emit.apply(emitter, [...data]);
    emit.apply(emitter, JSON.parse(data));
  });

  emitter.emit = function() {
    // if(process.connected){
      // process.send(sliced(arguments));
      // process.send(Array.from(arguments));
      ipc.broadcastMessage(JSON.stringify(Array.from(arguments)));
    // }
  }

  return emitter;
}
