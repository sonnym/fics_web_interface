"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("underscore");

var FICSClient = require("fics");

var log = require("./logger");

var SocketHandler = function(connection, debug) {
  this.connection = connection;
  this.debug = debug;

  var self = this;
  this.connection.on("data", function(rawMessage) {
    var message = JSON.parse(rawMessage);

    self[message.operation](message.params);
  });

  this.connection.on("close", function() {
    global.serverData.userCount--;

    if (self.client) {
      self.client.end();
    }
  });
};

SocketHandler.prototype.login = function(params) {
  this.client = new FICSClient();

  openSessionLog.call(this);
  handleSocketClose.call(this, params);

  this.client.chat().progress(_.bind(this.sendMessage, this, "chatMessage"));

  if (this.debug) {
    this.client.lines(_.bind(this.sendMessage, this, "raw"));
  }

  var self = this;
  this.client.login(params)
    .then(_.bind(this.sendMessage, this, "login"))
    .fail(function() {
      self.sendMessage("loginFailure");
      self.client.close();
    });
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

SocketHandler.prototype.serverData = function() {
  this.sendMessage("serverData", global.serverData);
};

SocketHandler.prototype.sendMessage = function(operation, data) {
  this.connection.write(JSON.stringify({ operation: operation, data: data }));
};

SocketHandler.prototype.passthrough = function(clientFn, responseMessage) {
  this.client[clientFn]().then(this.sendMessage.bind(this, responseMessage));
};

module.exports = SocketHandler;

function openSessionLog() {
  if (process.env.NODE_ENV === "development") {
    var sessionLog = fs.createWriteStream(path.join(process.cwd(), "log", "session.log"), {
     flags: "a"
    });

    this.client.getStream().pipe(sessionLog);
  }
}

function handleSocketClose(params) {
  var self = this;

  this.client.on("close", _.wrap(this.login.bind(this, params), function(callback) {
    var message = "Socket closed - re-logging user for websocket: " + self.connection;

    log.getLogger().info(message);

    callback();
  }));
}
