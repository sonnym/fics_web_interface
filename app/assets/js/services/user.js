ficsClient.factory("User", ["Proxy", function(Proxy) {
  var username;

  Proxy.registerMessage("login", function(data) {
    username = data.username;

    Proxy.sendMessage("gameList");
    Proxy.sendMessage("soughtList");

    Proxy.sendMessage("userList");

    Proxy.sendMessage("channelList");
    Proxy.sendMessage("subscribedChannelList");
  });

  return {
    login: function(userData) {
      Proxy.sendMessage("login", userData);
    },

    getUsername: function() { return username },
  };
}]);
