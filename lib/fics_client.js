var net = require("net");

var Q = require("q");

var fics_host = "freechess.org";
var fics_port = 5000;

var FICSClient = function() {
  this.socket = net.connect({ port: fics_port, host: fics_host });
  this.deferred = Q.defer();

  var self = this;
  this.socket.on("data", function(data) {
    self.deferred.notify(data.toString());
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
  });
};

module.exports = FICSClient;
