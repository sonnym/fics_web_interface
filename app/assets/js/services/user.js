ficsClient.factory("User", ["$cookieStore", "Proxy", function($cookieStore, Proxy) {
  var isLoggingIn = false;
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
    login($cookieStore.get("userData"));
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

      login(userData);
    },

    isLoggingIn: function() { return isLoggingIn },

    getUsername: function() { return username },
    isGuest: function() { return isGuest }
  };

  function login(userData) {
    isLoggingIn = true;
    Proxy.sendMessage("login", userData);
  }
}]);
