var path = require("path");
var FICSClient = require(path.join(__dirname, "fics_client"));

var SocketHandler = function(connection) {
  this.connection = connection;

  var self = this;
  this.connection.on("data", function(raw_message) {
    var message = JSON.parse(raw_message);

    switch(message.operation) {
    case "login":
      self.login(message.params);
    }
  });
};

SocketHandler.prototype.send_message = function(operation, data) {
  this.connection.write(JSON.stringify({ operation: operation, data: data }));
};

SocketHandler.prototype.login = function(params) {
  this.interface = new FICSClient();

  var self = this
  this.interface.promise.then(null, null, function(data) {
    self.send_message("raw", data);
  });

  this.interface.login(params);
};

module.exports = SocketHandler;
