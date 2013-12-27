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
      socket.send(JSON.stringify({ operation: operation, params: (params || {}) }));
    });
  }

  function ensureSocket(cb) {
    if (socketOpen) {
      cb();
    } else {
      socket.onopen(cb);
    }
  }

  function channelList() {
    sendMessage("channelList");
  };

  function userList() {
    sendMessage("userList");
  };

  function gameList() {
    sendMessage("gameList");
  };

  return this;
});
