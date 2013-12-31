ficsClient.factory("User", ["Proxy", function(Proxy) {
  var username, isGuest;

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
      if (!(userData.login && userData.password)) {
        isGuest = true;
      }

      Proxy.sendMessage("login", userData);
    },

    getUsername: function() { return username },
    isGuest: function() { return isGuest }
  };
}]);
