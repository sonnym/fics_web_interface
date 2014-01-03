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
 * set up logging
 */
var log = bunyan.createLogger({
  name: "fics",
  serializers: bunyan.stdSerializers,
  streams: [{
    level: isProduction ? "info" : "debug",
    path: path.join(rootPath, "log", environment + ".log")
  }]
});

server.on("request", function(request, response) {
  log.info({ req: request });

  response.on("finish", function() {
    log.info({ res: response });
  });
});

socket.on("connection", function(connection) {
  log.info({ socketConnect: { id: connection.id } });

  connection.on("data", function(data) {
    try {
      data = JSON.parse(data);
    } catch(e) {
      return;
    }

    log.info({ socketData: { id: connection.id, data: data } });
  });

  connection.on("close", function() {
    log.info({ socketClose: connection.id });
  });
});

/*
 * start server
 */
server.listen(port, "0.0.0.0");
