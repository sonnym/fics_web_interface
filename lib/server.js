var http = require("http");
var path = require("path");

var bunyan = require("bunyan");
var express = require("express");
var sockjs = require("sockjs");

var ConnectMincer = require("connect-mincer");

var SocketHandler = require("./socket_handler");

var rootPath = path.join(__dirname, "..");
var environment = process.env.NODE_ENV || "development";

var isProduction = (process.env.NODE_ENV === "production");
var port = (isProduction ? 80 : 8000);

var app = express();
var server = http.createServer(app);

var log = bunyan.createLogger({
  name: "fics",
  streams: [{
    level: isProduction ? "info" : "debug",
    path: path.join(rootPath, "log", environment + ".log")
  }]
});

/**
 * set up assets
 */
var connectMincer = new ConnectMincer({
  root: rootPath,
  production: false,
  mountPoint: "/assets",
  manifestFile: path.join(rootPath, "public", "assets", "manifest.json"),
  paths: [ path.join(rootPath, "app", "assets", "css")
         , path.join(rootPath, "app", "assets", "js")
         ]
});

app.use(connectMincer.assets());
app.use("/assets", connectMincer.createServer());

app.get("/", function(req, res) {
  res.render(path.join(rootPath, "app", "templates", "index.ejs"));
});

/*
 * serve static files
 */
app.use(express.static(path.join(rootPath, "public")));

/*
 * handle sockets
 */
var sockjsOpts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js" }
var socket = sockjs.createServer(sockjsOpts);

server.addListener("upgrade", function(req, res){
  res.end();
});

socket.on("connection", function(connection) {
  new SocketHandler(connection);
});

socket.installHandlers(server, { prefix: "/socket" });

/*
 * start server
 */
server.listen(port, "0.0.0.0");
