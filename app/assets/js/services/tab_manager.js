ficsClient.factory("TabManager", ["$rootScope", "$timeout", function($rootScope, $timeout) {
  var tabs = { login: true, console: false, chat: false, play: false, watch: false };

  return {
    attach: function() {
      $rootScope.tabs = tabs;

      $rootScope.changeTab = function(activeTab) {
        $rootScope.tabs = _.reduce(tabs, function(obj, active, tab) {
          obj[tab] = tab === activeTab;

          return obj;
        }, {});

        console.log();
      };

      $rootScope.isActiveTab = function(tab) {
        return tab === activeTab();
      };
    },

    watchLogin: function() {
      if ($rootScope.isLoggedIn && $rootScope.isActiveTab("login")) {
        // next run of the event loop, since the changing tabs
        // cause the last tab to become active by default
        $timeout(_.partial(_.bindAll($rootScope, "changeTab").changeTab, "chat"));
      }
    }
  };

  function activeTab() {
    return _.invert(tabs)[true];
  }
}]);
