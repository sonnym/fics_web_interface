var path = require("path");
var FICSClient = require("fics");

var SocketHandler = function(connection) {
  this.connection = connection;

  var self = this;
  this.connection.on("data", function(rawMessage) {
    var message = JSON.parse(rawMessage);

    self[message.operation](message.params);
  });

  this.connection.on("close", function() {
    if (self.interface) {
      self.interface.end();
    }
  });
};

SocketHandler.prototype.sendMessage = function(operation, data) {
  this.connection.write(JSON.stringify({ operation: operation, data: data }));
};

SocketHandler.prototype.passthrough = function(interfaceFn, responseMessage) {
  var self = this;
  this.interface[interfaceFn]().then(function(data) {
    self.sendMessage(responseMessage, data);
  });
};

SocketHandler.prototype.channelList = function() {
  this.passthrough("channelList", "channelList");
};

SocketHandler.prototype.subscribedChannelList = function() {
  this.passthrough("channels", "subscribedChannelList");
};

SocketHandler.prototype.gameList = function() {
  this.passthrough("games", "gameList");
};

SocketHandler.prototype.userList = function() {
  this.passthrough("who", "userList");
};

SocketHandler.prototype.soughtList = function() {
  this.passthrough("sought", "soughtList");
};

SocketHandler.prototype.login = function(params) {
  this.interface = new FICSClient();

  var self = this

  if (process.env.NODE_ENV === "development") {
    this.interface.getSocket().on("data", function(data) {
      self.sendMessage("raw", data.toString());
    });
  }

  this.interface.chat().progress(function(data) {
    self.sendMessage("chatMessage", data);
  });

  this.interface.login(params).then(function(userData) {
    self.sendMessage("login", userData);
  });
};

SocketHandler.prototype.shout = function(messageData) {
  this.interface.shout(messageData.message, messageData.it);
};

SocketHandler.prototype.tell = function(messageData) {
  this.interface.tell(messageData.recipient, messageData.message);
};

SocketHandler.prototype.joinChannel = function(channelData) {
  this.interface.joinChannel(channelData.number);
};

SocketHandler.prototype.leaveChannel = function(channelData) {
  this.interface.leaveChannel(channelData.number);
};

SocketHandler.prototype.observe = function(gameData) {
  var gameNumber = gameData.number;

  var self = this;
  this.interface.observe(gameNumber).progress(function(gameData) {
    self.sendMessage("observeUpdate", { number: gameNumber, update: gameData });
  });
};

SocketHandler.prototype.moveList = function(gameData) {
  var self = this;
  this.interface.moves(gameData.number).then(function(moves) {
    self.sendMessage("moveList", { number: gameData.number, moves: moves });
  });
};

SocketHandler.prototype.observerList = function(gameData) {
  var self = this;
  this.interface.observers(gameData.number).then(function(observers) {
    self.sendMessage("observerList", { number: gameData.number, observers: observers });
  });
};

SocketHandler.prototype.kibitz = function(gameData) {
  this.interface.kibitz(gameData.number, gameData.message);
};

SocketHandler.prototype.whisper = function(gameData) {
  this.interface.whisper(gameData.number, gameData.message);
};

SocketHandler.prototype.unobserve = function(gameData) {
  this.interface.unobserve(gameData.number);
};

module.exports = SocketHandler;
