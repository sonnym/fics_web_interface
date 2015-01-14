ficsClient.factory("Console", ["Proxy", "FiniteArray", function(Proxy, FiniteArray) {
  var output = new FiniteArray(5000);

  Proxy.registerMessage("raw", function(data) {
    output = output.concat(data.split("\n"));
  });

  return {
    get: function() { return output },
  };
}]);
