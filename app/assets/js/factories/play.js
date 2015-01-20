ficsClient.factory("Play", ["Proxy", function(Proxy) {
  var sought = [];

  Proxy.registerMessage("soughtList", function(data) {
    sought = data;
  });

  return {
    activate: function() {
      Proxy.sendMessage("soughtList");
    },

    getSought: function() { return sought }
  };
}]);
