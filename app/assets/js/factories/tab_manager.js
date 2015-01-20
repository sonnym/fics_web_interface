ficsClient.factory("TabManager", ["ActivityNotifier", function(ActivityNotifier) {
  return function(scope, tabs) {
    tabs = _.reduce(tabs, function(memo, data, name) {
      memo[name] = new ActivityNotifier(data);

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
