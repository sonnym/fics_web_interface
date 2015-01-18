var fs = require("fs");
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
    if (self.client) {
      self.client.end();
    }
  });
};

SocketHandler.prototype.sendMessage = function(operation, data) {
  this.connection.write(JSON.stringify({ operation: operation, data: data }));
};

SocketHandler.prototype.passthrough = function(clientFn, responseMessage) {
  var self = this;
  this.client[clientFn]().then(function(data) {
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
  this.client = new FICSClient();

  var self = this

  if (process.env.NODE_ENV === "development") {
    var socket = this.client.getSocket();

    socket.pipe(fs.createWriteStream(path.join(process.cwd(), "log", "session.log"), { flags: "a" }));

    this.client.lines(function(line) {
      self.sendMessage("raw", line);
    });
  }

  this.client.chat().progress(function(data) {
    self.sendMessage("chatMessage", data);
  });

  this.client.login(params)
    .then(function(userData) {
      self.sendMessage("login", userData);
    })
    .fail(function() {
      self.sendMessage("loginFailure");
      self.client.close();
    });
};

SocketHandler.prototype.shout = function(messageData) {
  this.client.shout(messageData.message, messageData.it);
};

SocketHandler.prototype.tell = function(messageData) {
  this.client.tell(messageData.recipient, messageData.message);
};

SocketHandler.prototype.joinChannel = function(channelData) {
  this.client.joinChannel(channelData.number);
};

SocketHandler.prototype.leaveChannel = function(channelData) {
  this.client.leaveChannel(channelData.number);
};

SocketHandler.prototype.observe = function(gameData) {
  var gameNumber = gameData.number;

  var self = this;
  this.client.observe(gameNumber).progress(function(gameData) {
    self.sendMessage("observeUpdate", { number: gameNumber, update: gameData });
  });
};

SocketHandler.prototype.moveList = function(gameData) {
  var self = this;
  this.client.moves(gameData.number).then(function(moves) {
    self.sendMessage("moveList", { number: gameData.number, moves: moves });
  });
};

SocketHandler.prototype.observerList = function(gameData) {
  var self = this;
  this.client.observers(gameData.number).then(function(observers) {
    self.sendMessage("observerList", { number: gameData.number, observers: observers });
  });
};

SocketHandler.prototype.kibitz = function(gameData) {
  this.client.kibitz(gameData.number, gameData.message);
};

SocketHandler.prototype.whisper = function(gameData) {
  this.client.whisper(gameData.number, gameData.message);
};

SocketHandler.prototype.unobserve = function(gameData) {
  this.client.unobserve(gameData.number);
};

module.exports = SocketHandler;
