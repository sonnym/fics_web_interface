ficsClient.factory("Play", ["Proxy", function(Proxy) {
  var sought = [];

  Proxy.registerMessage("soughtList", function(data) {
    sought = data;
  });

  return {
    notifier: {
      activate: function() {
        Proxy.sendMessage("soughtList");
      }
    },

    getSought: function() { return sought }
  };
}]);
