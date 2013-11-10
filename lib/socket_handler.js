var path = require("path");
var FICSClient = require(path.join(__dirname, "fics_client"));

var SocketHandler = function(connection) {
  this.connection = connection;

  var self = this;
  this.connection.on("data", function(raw_message) {
    var message = JSON.parse(raw_message);

    self[message.operation](message.params);
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

  this.interface.login(params).then(function() {
    self.send_message("login", {});
  });
};

SocketHandler.prototype.channel_list = function() {
  var self = this;
  this.interface.channel_list().then(function(channels) {
    self.send_message("channel_list", channels);
  });
};

SocketHandler.prototype.game_list = function() {
  var self = this;
  this.interface.games().then(function(games) {
    self.send_message("game_list", games);
  });
};

module.exports = SocketHandler;
