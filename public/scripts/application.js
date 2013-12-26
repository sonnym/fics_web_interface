var ficsClient = angular.module("ficsClient", ["ui.bootstrap.tabs"]);

ficsClient.run(["$rootScope", "User", function($rootScope, User) {
  $rootScope.isLoggedIn = function() {
    return angular.isDefined(User.getUsername());
  }
}]);

function LoginCtrl($scope, Proxy) {
  $scope.loginAsGuest = function() {
    Proxy.login({});
  };

  $scope.loginWithCredentials = function(userData) {
    Proxy.login(userData);
  };
};

function ConsoleCtrl($scope, Console) {
  $scope.output = Console.get;
};

function ChatCtrl($scope, Chat) {
  $scope.channels = function() {
    return Chat.channels();
  };

  $scope.users = function() {
    return Chat.users();
  };
}

function ObservationCtrl($scope, Observe) {
  $scope.games = function() {
    return Observe.games();
  };
}

ficsClient.factory("Proxy", function(Console, User, Chat, Observe) {
  var socket = this.socket = new SockJS("/socket");
  var socketOpen = false;

  socket.onopen = function() {
    socketOpen = true;
  };

  socket.onclose = function() {
    socketOpen = false;
  };

  socket.onmessage = function(e) {
    if (e.type !== "message") {
      return;
    }

    var message = JSON.parse(e.data);

    switch(message.operation) {
    case "login":
      User.setUsername(message.data.username);

      userList();
      channelList();
      gameList();

      break;
    case "raw":
      Console.append(message.data);
      break;
    case "channelList":
      Chat.setChannels(message.data);
      break;
    case "gameList":
      Observe.setGames(message.data);
      break;
    case "userList":
      Chat.setUsers(message.data);
      break;
    }
  };

  this.login = function(userData) {
    sendMessage("login", userData);
  };

  function sendMessage(operation, params) {
    ensureSocket(function() {
      socket.send(JSON.stringify({ operation: operation, params: params }));
    });
  }

  function ensureSocket(cb) {
    await(function() { return socketOpen; }, cb)
  }

  function await(condition, cb) {
    (function wait() {
      if (condition()) cb();
      else setTimeout(wait, 50);
    })();
  }

  function channelList() {
    sendMessage("channelList", {});
  };

  function userList() {
    sendMessage("userList", {});
  };

  function gameList() {
    sendMessage("gameList", {});
  };

  return this;
});

ficsClient.factory("User", function() {
  var username;

  return {
    getUsername: function() { return username },
    setUsername: function(val) { username = val }
  };
});

ficsClient.factory("Console", function() {
  var output = "";

  return {
    get: function() { return output },
    append: function(data) { output += data }
  };
});

ficsClient.factory("Chat", function() {
  var channels;
  var users;

  return {
    users: function() { return users },
    channels: function() { return channels },

    setUsers: function(val) { users = val },
    setChannels: function(val) { channels = val }
  }
});

ficsClient.factory("Observe", function() {
  var games;

  return {
    games: function() { return games },
    setGames: function(val) { games = val }
  }
});
