ficsClient.factory("Chat", ["Proxy", function(Proxy) {
  var users, channels, subscribedChannels;
  var chatMessages = { global: [], channel: {}, user: {} };

  var newMessages = true;

  Proxy.registerMessage("channelList", function(data) {
    channels = data;
  });

  Proxy.registerMessage("subscribedChannelList", function(data) {
    subscribedChannels = data;
  });

  Proxy.registerMessage("userList", function(data) {
    users = data;
  });

  Proxy.registerMessage("chatMessage", function(data) {
    newMessages = true;

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

      var messages = container[key];

      if (messages) {
        messages.push(data);
      } else {
        container[key] = [data];
      }
    }
  });

  return {
    activate: function() {
      newMessages = false;

      Proxy.sendMessage("userList");
      Proxy.sendMessage("channelList");
      Proxy.sendMessage("subscribedChannelList");
    },

    notify: function() {
      return newMessages;
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
      chatMessages.user[username] = chatMessages.user[username] || [];
    },

    closePrivateMessage: function(username) {
      delete chatMessages.user[username];
    }
  }
}]);
