var http = require("http");
var path = require("path");

var express = require("express");
var sockjs = require("sockjs");

var ConnectMincer = require("connect-mincer");

var SocketHandler = require("./socket_handler");

var rootPath = path.join(__dirname, "..");
var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);
var sockjsOpts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js" }

var app = express();

var connectMincer = new ConnectMincer({
  root: rootPath,
  production: false,
  mountPoint: "/assets",
  manifestFile: path.join(rootPath, "public/assets/manifest.json"),
  paths: [ path.join(rootPath, "app", "assets", "css")
         , path.join(rootPath, "app", "assets", "js")
         ]
});

app.use(connectMincer.assets());
app.use("/assets", connectMincer.createServer());

app.get("/", function(req, res) {
  res.render(path.join(rootPath, "app", "templates", "index.ejs"));
});

var socket = sockjs.createServer(sockjsOpts);

app.use(express.static(path.join(rootPath, "/public")));

var server = http.createServer(app);

server.addListener("upgrade", function(req, res){
  res.end();
});

socket.on("connection", function(connection) {
  new SocketHandler(connection);
});

socket.installHandlers(server, { prefix: "/socket" });

server.listen(port, "0.0.0.0");
