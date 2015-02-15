var sockjs = require("sockjs");

var SocketConnection = require("./socket_connection");

var sockjsOpts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js" }
var socket = sockjs.createServer(sockjsOpts);

module.exports.listen = function(server) {
  server.addListener("upgrade", function(req, res) {
    res.end();
  });

  socket.on("connection", function(connection) {
    new SocketConnection(connection);
  });

  socket.installHandlers(server, { prefix: "/socket" });

  return socket;
};
