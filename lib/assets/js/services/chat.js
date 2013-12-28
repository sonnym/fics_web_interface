ficsClient.factory("Chat", ["Proxy", function(Proxy) {
  var users, channels, subscribedChannels;

  Proxy.registerMessage("channelList", function(data) {
    channels = data;
  });

  Proxy.registerMessage("subscribedChannelList", function(data) {
    subscribedChannels = data;
  });

  Proxy.registerMessage("userList", function(data) {
    users = data;

    setTimeout(function() { Proxy.sendMessage("userList") }, 1000);
  });

  return {
    users: function() { return users },
    channels: function() { return channels },
    subscribedChannels: function() { return subscribedChannels }
  }
}]);
