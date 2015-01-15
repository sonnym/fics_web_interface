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

    var self = this;
    this.watchLogin = function() {
      if (scope.isLoggedIn && isActiveTab("login")) {
        // next run of the event loop, since the changing tabs
        // cause the last tab to become active by default
        $timeout(_.partial(_.bindAll(scope, "changeTab").changeTab, "chat"));
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
