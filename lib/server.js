var http = require("http");
var path = require("path");

var express = require("express");

/***/
var Logger = require("./logger");

var AssetHandler = require("./asset_handler");
var SocketHandler = require("./socket_handler");

/***/
var rootPath = path.join(__dirname, "..");
var environment = process.env.NODE_ENV || "development";

var isProduction = (process.env.NODE_ENV === "production");
var port = (isProduction ? 80 : 8000);

/***/
var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(rootPath, "public")));

var socket = SocketHandler.listen(server);
AssetHandler.listen(app, rootPath);
Logger.listen(server, socket, rootPath, environment);

server.listen(port, "0.0.0.0");
