ficsClient.factory("Console", ["Proxy", function(Proxy) {
  var output = "";

  Proxy.registerMessage("raw", function(data) {
    output += data;
  });

  return {
    get: function() { return output },
  };
}]);
