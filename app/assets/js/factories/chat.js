ficsClient.factory("Chat", ["Constants", "Proxy", "MessageCollection", function(Constants, Proxy, MessageCollection) {
  var users, subscribedChannels;
  var chatMessages = {
    global: new MessageCollection(),
    channel: {},
    user: {}
  };

  var channels = _.reduce(Constants.channels, function(memo, name, number) {
    memo.push({ number: number, name: name });
    return memo;
  }, []);

  Proxy.registerMessage("subscribedChannelList", function(data) {
    subscribedChannels = data;
  });

  Proxy.registerMessage("userList", function(data) {
    users = data;
  });

  Proxy.registerMessage("chatMessage", function(data) {
    if (data.type === "shout" || data.type === "it") {
      chatMessages.global.push(data);

    } else if (data.type === "tell") {
      if (data.channel) {
        var key = data.channel;
        var container = chatMessages.channel;
      } else {
        var key = data.user;
        var container = chatMessages.user;
      }

      var messageCollection = container[key];

      if (messageCollection) {
        messageCollection.push(data);
      } else {
        container[key] = new MessageCollection(data);
      }
    }
  });

  return {
    notifier: {
      activate: function() {
        Proxy.sendMessage("userList");
        Proxy.sendMessage("subscribedChannelList");
      },

      update: function() {
        Proxy.sendMessage("userList");
      },

      notify: function() {
        return chatMessages.global.notify() ||
          _.any(chatMessages.channel, function(channel) { return channel.notify() }) ||
          _.any(chatMessages.user, function(user) { return user.notify() });
      },
    },

    users: function() { return users },
    channels: function() { return channels },
    subscribedChannels: function() { return subscribedChannels },

    messages: function() { return chatMessages },

    shout: function(mode, message) {
      Proxy.sendMessage("shout", { message: message, it: (mode === "it") });
    },

    joinChannel: function(channelNumber) {
      Proxy.sendMessage("joinChannel", { number: channelNumber });
      subscribedChannels = _.union(subscribedChannels, [channelNumber]);
    },

    leaveChannel: function(channelNumber) {
      Proxy.sendMessage("leaveChannel", { number: channelNumber });
      subscribedChannels = _.without(subscribedChannels, channelNumber);
    },

    sendMessage: function(recipient) {
      return function(message) {
        Proxy.sendMessage("tell", { recipient: recipient, message: message });
      };
    },

    startPrivateMessage: function(username) {
      chatMessages.user[username] = chatMessages.user[username] || new MessageCollection();
    },

    closePrivateMessage: function(username) {
      delete chatMessages.user[username];
    }
  }
}]);
