ficsClient.factory("TabManager", ["$timeout", function($timeout) {
  return function(scope, tabs) {
    tabs = _.reduce(tabs, function(memo, data, name) {
      var active = data.active;

      Object.defineProperty(data, "active", {
        get: function() {
          return active;
        },

        set: function(newVal) {
          active = newVal;
        }
      });

      memo[name] = data;

      return memo;
    }, {});

    Object.defineProperty(this, "tabs", {
      enumerable: true,
      get: function() {
        return tabs;
      },
    });

    this.checkForAndSwitchTo = function(from, to) {
      if (isActiveTab(from)) {
        // next run of the event loop, to allow the in progress
        // tab changes to complete
        $timeout(function() {
          tabs[to].active = true;
        });
      }
    };

    function activeTabName() {
      return _.invert(_.reduce(tabs, function(memo, tabData, tabName) {
        memo[tabName] = tabData.active;

        return memo;
      }, {}))[true];
    }

    function isActiveTab(tabName) {
      return tabName === activeTabName();
    };
  };
}]);
