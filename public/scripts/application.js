var fics_client = (function() {
  var socket = this.socket = new SockJS("/socket");
  var socket_open = false;

  socket.onopen = function() {
    socket_open = true;
  };

  socket.onclose = function() {
    socket_open = false;
  };

  socket.onmessage = function(e) {
    if (e.type !== "message") {
      return;
    }

    var message = JSON.parse(e.data);

    switch(message.operation) {
    case "raw":
      console.log(message.data)
    }
  };

  this.login_as_guest = function() {
    send_message("login", {});
  };

  function send_message(operation, params) {
    ensure_socket(function() {
      socket.send(JSON.stringify({ operation: operation, params: params }));
    });
  }

  function ensure_socket(cb) {
    wait_for(function() { return socket_open; }, cb)
  }

  function wait_for(condition, cb) {
    (function wait() {
      if (condition()) cb();
      else setTimeout(wait, 50);
    })();
  }

  return this;
})();
