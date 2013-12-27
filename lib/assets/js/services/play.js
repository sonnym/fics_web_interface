ficsClient.factory("Play", ["Proxy", function(Proxy) {
  var sought = [];

  Proxy.registerMessage("soughtList", function(data) {
    sought = data;
  });

  return {
    getSought: function() { return sought }
  };
}]);
