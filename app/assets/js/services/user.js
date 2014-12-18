ficsClient.factory("User", ["$cookieStore", "Proxy", function($cookieStore, Proxy) {
  var username, isGuest;

  Proxy.registerMessage("login", function(data) {
    username = data.username;

    Proxy.sendMessage("gameList");
    Proxy.sendMessage("soughtList");

    Proxy.sendMessage("userList");

    Proxy.sendMessage("channelList");
    Proxy.sendMessage("subscribedChannelList");
  });

  if ($cookieStore.get("userData")) {
    Proxy.sendMessage("login", $cookieStore.get("userData"));
  }

  return {
    login: function(userData, remember) {
      if (!(userData.login && userData.password)) {
        isGuest = true;
      }

      if (remember) {
        $cookieStore.put("userData", userData);
      } else {
        $cookieStore.remove("userData");
      }

      Proxy.sendMessage("login", userData);
    },

    getUsername: function() { return username },
    isGuest: function() { return isGuest }
  };
}]);
