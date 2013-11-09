// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('JW34roQoNViCvrXp');

var http = require("http");

var express = require("express");
var sockjs = require("sockjs");

var SocketHandler = require("./lib/socket_handler");

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);
var sockjs_opts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js" }

var app = express();
var socket = sockjs.createServer(sockjs_opts);

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

server.addListener("upgrade", function(req, res){
  res.end();
});

socket.on("connection", function(connection) {
  new SocketHandler(connection);
});

socket.installHandlers(server, { prefix: "/socket" });

server.listen(port, "0.0.0.0");
