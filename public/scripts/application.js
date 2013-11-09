(function() {
  var socket = new SockJS("/socket");

  socket.onopen = function() {
    console.log("socket open");
  };

  socket.onmessage = function(e) {
    console.log("socket message: " + e.data);
  };

  socket.onclose = function() {
    console.log("socket close");
  };

  return this;
})();
