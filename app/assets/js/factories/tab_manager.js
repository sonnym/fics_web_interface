ficsClient.factory("TabManager", ["ActivityNotifier", function(ActivityNotifier) {
  return function(tabs) {
    this.tabs = _.reduce(tabs, function(memo, data, name) {
      memo[name] = new ActivityNotifier(data);

      return memo;
    }, {});

    this.isActiveTab = function(tabName) {
      return tabName === activeTabName();
    };

    var self = this;
    function activeTabName() {
      return _.invert(_.reduce(self.tabs, function(memo, tabData, tabName) {
        memo[tabName] = tabData.active;

        return memo;
      }, {}))[true];
    }
  };
}])
