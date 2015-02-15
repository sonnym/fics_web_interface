ficsClient.factory("ActivityNotifier", function($interval) {
  return ActivityNotifier;

  function ActivityNotifier(data) {
    var interval;

    Object.defineProperty(this, "active", {
      get: function() {
        return data.active;
      },

      set: function(newVal) {
        if (newVal && data.activate) {
          data.activate();

          if (data.update) {
            interval = $interval(data.activate.bind(data), 60000);
          }
        } else if (!newVal) {
          if (!_.isUndefined(interval)) {
            $interval.cancel(interval);
            interval = undefined;
          }

          if (data.deactivate) {
            data.deactivate();
          }
        }

        data.active = newVal;
      }
    });

    this.notify = function() {
      return !data.active && data.notify && data.notify();
    };
  };
});
