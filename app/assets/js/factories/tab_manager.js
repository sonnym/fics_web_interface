ficsClient.factory("TabManager", [function() {
  return function(scope, tabs) {
    tabs = _.reduce(tabs, function(memo, data, name) {
      var notifyCallback = data.notify;
      var active = data.active;

      Object.defineProperty(data, "active", {
        get: function() {
          return active;
        },

        set: function(newVal) {
          if (newVal && data.activate) {
            data.activate();
          };

          active = newVal;
        }
      });

      data.notify = function() {
        return !active && notifyCallback && notifyCallback();
      };

      memo[name] = data;

      return memo;
    }, {});

    Object.defineProperty(this, "tabs", {
      enumerable: true,
      get: function() {
        return tabs;
      },
    });

    this.isActiveTab = function(tabName) {
      return tabName === activeTabName();
    };

    function activeTabName() {
      return _.invert(_.reduce(tabs, function(memo, tabData, tabName) {
        memo[tabName] = tabData.active;

        return memo;
      }, {}))[true];
    }
  };
}]);
