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
  this.promise.then(null, null, function(data) {
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
  var matches = null;

  this.send_message("help channel_list");

  this.promise.then(null, null, function(data) {
    if (matches = data.match(/\d+(?:,\d+)*\s.*/g)) {
      _.each(matches, function(match) {
        var channel_data = match.split(/\s+/);
        var channel_numbers = channel_data.shift().split(",");

        _.each(channel_numbers, function(channel_number) {
          channels[channel_number] = channel_data.join(" ");
        });
      });
    }

    if (data.match(/SPECIAL NOTE/)) {
      deferred_channels.resolve(channels);
    }
  });

  return deferred_channels.promise;
};

module.exports = FICSClient;
