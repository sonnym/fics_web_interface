ficsClient.factory("User", function() {
  var username;

  return {
    getUsername: function() { return username },
    setUsername: function(val) { username = val }
  };
});
