var path = require("path");
var util = require("util");

var bunyan = require("bunyan");

module.exports.listen = function(server, socket, rootPath, environment) {
  var log = bunyan.createLogger({
    name: "fics",
    serializers: bunyan.stdSerializers,
    streams: [{
      level: "debug",
      path: path.join(rootPath, "log", environment + ".log")
    }]
  });

  server.on("request",   function(request, response) {
    log.info({ req: request });

    response.on("finish", function() {
      log.info({ res: response });
    });
  });

  socket.on("connection",   function(connection) {
    log.info({ socketConnect: { id: connection.id } });

    connection.on("data", function(data) {
      try {
        data = JSON.parse(data);
      } catch(e) {
        return;
      }

      if (data.params && data.params.password) {
        data.params.password = "[REDACTED]";
      }

      log.info({ socketData: { id: connection.id, data: data } });
    });

    connection.on("close", function() {
      log.info({ socketClose: connection.id });
    });
  });

  process.on("uncaughtException", function(exception) {
    if (environment === "development") {
      console.log("EXCEPTION:");
      console.log(util.inspect(exception));
      console.log(exception.stack);
    }

    log.error({ err: exception });
  });
};
