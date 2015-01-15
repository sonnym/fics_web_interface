ficsClient.factory("Play", ["Proxy", function(Proxy) {
  var sought = [];

  Proxy.registerMessage("soughtList", function(data) {
    sought = data;

    // setTimeout(function() { Proxy.sendMessage("soughtList") }, 1000);
  });

  return {
    activate: function() {
      Proxy.sendMessage("soughtList");
    },

    getSought: function() { return sought }
  };
}]);
