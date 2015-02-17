"use strict";

var http = require("http");
var path = require("path");

var express = require("express");

/***/
var Logger = require("./logger");

var AssetHandler = require("./asset_handler");
var SocketHandler = require("./socket_handler");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

/***/
var rootPath = path.join(__dirname, "..");

global.serverData = { userCount: 0 };

/***/
var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(rootPath, "public")));

var socket = SocketHandler.listen(server);
AssetHandler.listen(app, rootPath);
Logger.listen(server, socket, rootPath, process.env.NODE_ENV);

server.listen(8000, "0.0.0.0");
