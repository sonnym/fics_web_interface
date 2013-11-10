var net = require("net");

var Q = require("q");
var _ = require("underscore");

var fics_host = "freechess.org";
var fics_port = 5000;

var FICSClient = function() {
  this.socket = net.connect({ port: fics_port, host: fics_host });
  this.deferred = Q.defer();

  var self = this;
  this.socket.on("data", function(data) {
    self.deferred.notify(data.toString());
  });

  this.promise.then(null, null, function(data) {
    if (data.match(/Type \[next\] to see next page\./)) {
      self.send_message("next");
    }
  });
};

FICSClient.prototype.__defineGetter__("promise", function() {
  return this.deferred.promise;
});

FICSClient.prototype.__defineGetter__("lines", function() {
  var deferred_data = Q.defer();
  var buffered_data = "";

  this.promise.then(null, null, function(data) {
    var lines = (buffered_data + data).split("\n");

    if (data[data.length - 1] !== "\n" && data.substr(-2, 2) !== ": ") {
      buffered_data = lines.pop();
    }

    _.each(lines, function(line) {
      deferred_data.notify(line);
    });
  });

  return function(cb) {
    deferred_data.promise.then(null, null, cb);
  };
});

FICSClient.prototype.send_message = function(message) {
  this.socket.write(message + "\n", "utf8");
}

FICSClient.prototype.login = function(user_data) {
  if (user_data.login) {
    var username = user_data.login;
    var password = user_data.password;
  } else {
    var username = "guest";
  }

  var deferred_login = Q.defer();

  var self = this;
  this.lines(function(data) {
    if (data.match(/login:/)) {
      self.send_message(username);
    }

    if (data.match(/password:/)) {
      self.send_message(password);
    }

    if (data.match(/Press return/)) {
      self.send_message("");
    }

    if (data.match(/\*\*\*\* Starting FICS session as .* \*\*\*\*/)) {
      deferred_login.resolve();
    }
  });

  return deferred_login.promise;
};

FICSClient.prototype.channel_list = function() {
  var deferred_channels = Q.defer();

  var channels = {};
  var match = null;

  this.send_message("help channel_list");

  this.lines(function(data) {
    if (match = data.match(/\d+(?:,\d+)*\s.*/g)) {
      var channel_data = match[0].split(/\s+/);
      var channel_numbers = channel_data.shift().split(",");

      _.each(channel_numbers, function(channel_number) {
        channels[channel_number] = channel_data.join(" ");
      });
    }

    if (data.match(/SPECIAL NOTE/)) {
      deferred_channels.resolve(channels);
    }
  });

  return deferred_channels.promise;
};

FICSClient.prototype.games = function() {
  var deferred_games = Q.defer();

  var games = [];
  var match = null;

  this.send_message("games");

  this.lines(function(data) {
    if (match = data.match(/(\d+)\s+(\d+|\+{4})\s+(\w+)\s+(\d+|\+{4})\s+(\w+)\s+\[.*\]\s+((?:\d+:)?\d+:\d+)\s+-\s+((?:\d+:)?\d+:\d+)\s+\(.*\)\s+(W|B):\s+(\d+)/)) {
      games.push({ number: match[1]
                 , white: { name: match[3], rating: match[2], time: match[6] }
                 , black: { name: match[5], rating: match[4], time: match[7] }
                 , move: { color: match[8], number: match[9] }
                 });
    }

    if (data.match(/\d+ games displayed./)) {
      deferred_games.resolve(games);
    }
  });

  return deferred_games.promise;
};

module.exports = FICSClient;
