"use strict";

var _ = require("underscore");
var sockjs = require("sockjs");

var SocketConnection = require("./socket_connection");

var sockjsOpts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js" }
var socket = sockjs.createServer(sockjsOpts);

module.exports.listen = function(server) {
  var debug = false;

  server.addListener("upgrade", function(req, res) {
    debug = !_.isUndefined(req.query.debug);

    res.end();
  });

  socket.on("connection", function(connection) {
    new SocketConnection(connection, debug);
  });

  socket.installHandlers(server, { prefix: "/socket" });

  return socket;
};
