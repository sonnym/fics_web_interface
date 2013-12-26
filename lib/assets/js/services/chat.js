ficsClient.factory("Chat", function() {
  var channels;
  var users;

  return {
    users: function() { return users },
    channels: function() { return channels },

    setUsers: function(val) { users = val },
    setChannels: function(val) { channels = val }
  }
});
