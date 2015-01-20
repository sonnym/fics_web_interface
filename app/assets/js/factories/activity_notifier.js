ficsClient.factory("ActivityNotifier", function() {
  return function(data) {
    var copy = angular.copy(data);

    var notifyCallback = copy.notify;
    var active = copy.active;

    Object.defineProperty(copy, "active", {
      get: function() {
        return active;
      },

      set: function(newVal) {
        if (newVal && copy.activate) {
          copy.activate();
        };

        active = newVal;
      }
    });

    copy.notify = function() {
      return !active && notifyCallback && notifyCallback();
    };

    return copy;
  };
});
