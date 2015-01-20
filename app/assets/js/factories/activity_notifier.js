ficsClient.factory("ActivityNotifier", function() {
  return ActivityNotifier;

  function ActivityNotifier(data) {
    Object.defineProperty(this, "active", {
      get: function() {
        return data.active;
      },

      set: function(newVal) {
        if (newVal && data.activate) {
          data.activate();
        };

        data.active = newVal;
      }
    });

    this.notify = function() {
      return !data.active && data.notify && data.notify();
    };
  };
});
