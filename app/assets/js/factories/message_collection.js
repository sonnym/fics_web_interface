ficsClient.factory("MessageCollection", ["FiniteArray", "ActivityNotifier", function(FiniteArray, ActivityNotifier) {
  function MessageCollection(message) {
    this.messages = new FiniteArray();
    this.newMessages = false;

    if (message) {
      this.push(message)
    }

    var self = this;
    ActivityNotifier.call(this, {
      active: false,

      deactivate: function() {
        self.newMessages = false;
      },

      notify: function() {
        return self.newMessages;
      }
    });
  }

  MessageCollection.prototype.push = function(message) {
    this.newMessages = true;
    this.messages.push(message);
  };

  return MessageCollection;
}]);
