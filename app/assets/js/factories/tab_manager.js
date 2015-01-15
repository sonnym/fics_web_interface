ficsClient.factory("TabManager", ["$timeout", function($timeout) {
  return function(scope, tabs) {
    Object.defineProperty(this, "tabs", {
      enumerable: true,
      get: function() {
        return tabs;
      },
    });

    scope.changeTab = function(activeTab) {
      tabs = _.reduce(tabs, function(newTabs, tabData, tabName) {
        newTabs[tabName] = _.extend(tabData, {
          active: (tabName === activeTab)
        })

        return newTabs;
      }, {});
    };

    this.checkForAndSwitchTo = function(from, to) {
      if (isActiveTab(from)) {
        // next run of the event loop, to allow the in progress
        // tab changes to complete
        $timeout(_.partial(_.bindAll(scope, "changeTab").changeTab, to));
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
