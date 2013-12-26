var path = require("path");
var FICSClient = require("fics");

var SocketHandler = function(connection) {
  this.connection = connection;

  var self = this;
  this.connection.on("data", function(rawMessage) {
    var message = JSON.parse(rawMessage);

    self[message.operation](message.params);
  });
};

SocketHandler.prototype.sendMessage = function(operation, data) {
  this.connection.write(JSON.stringify({ operation: operation, data: data }));
};

SocketHandler.prototype.login = function(params) {
  this.interface = new FICSClient();

  var self = this
  this.interface.getSocket().on("data", function(data) {
    self.sendMessage("raw", data.toString());
  });

  this.interface.login(params).then(function(userData) {
    self.sendMessage("login", userData);
  });
};

SocketHandler.prototype.channelList = function() {
  var self = this;
  this.interface.channelList().then(function(channels) {
    self.sendMessage("channelList", channels);
  });
};

SocketHandler.prototype.gameList = function() {
  var self = this;
  this.interface.games().then(function(games) {
    self.sendMessage("gameList", games);
  });
};

SocketHandler.prototype.userList = function() {
  var self = this;
  this.interface.who().then(function(users) {
    self.sendMessage("userList", users);
  });
};

module.exports = SocketHandler;
