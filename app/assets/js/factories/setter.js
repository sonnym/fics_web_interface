ficsClient.factory("Setter", function() {
  return function(object) {
    return function(property) {
      return function(val) {
        object[property] = val;
      };
    };
  };
});
