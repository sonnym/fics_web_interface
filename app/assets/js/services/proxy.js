ficsClient.factory("Proxy", ["$rootScope", function($rootScope) {
  var socket = this.socket = new SockJS("/socket");
  var socketOpen = false;

  var messageHandlers = {};

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

    $rootScope.$apply(function() {
      messageHandlers[message.operation](message.data);
    });
  }

  function ensureSocket(cb) {
    if (socketOpen) {
      cb();
    } else {
      socket.onopen(cb);
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
}]);
