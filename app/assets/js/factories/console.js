ficsClient.factory("Console", ["Proxy", "FiniteArray", function(Proxy, FiniteArray) {
  var output = new FiniteArray(5000);

  Proxy.registerMessage("raw", output.push.bind(output));

  return {
    get: function() { return output }
  };
}]);
