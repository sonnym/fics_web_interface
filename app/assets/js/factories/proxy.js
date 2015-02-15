ficsClient.factory("Proxy", function($rootScope) {
  var socket = new SockJS("/socket");
  var socketOpen = false;

  var queue = [];
  var messageHandlers = {};

  socket.onopen = function() {
    socketOpen = true;

    while (queue.length > 0) {
      queue.shift()();
    }
  };

  socket.onclose = function() {
    socketOpen = false;
  };

  socket.onmessage = function(e) {
    if (e.type !== "message") {
      return;
    }

    var message = JSON.parse(e.data);

    $rootScope.$applyAsync(function() {
      messageHandlers[message.operation](message.data);
    });
  }

  function ensureSocket(callback) {
    if (socketOpen) {
      callback();
    } else {
      queue.push(callback);
    }
  }

  return {
    registerMessage: function(operation, callback) {
      messageHandlers[operation] = callback;
    },

    sendMessage: function(operation, params) {
      ensureSocket(function() {
        socket.send(JSON.stringify({ operation: operation, params: (params || {}) }));
      });
    }
  };
});
