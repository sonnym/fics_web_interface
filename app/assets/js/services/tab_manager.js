ficsClient.factory("TabManager", ["$rootScope", function($rootScope) {
  var tabs = { login: true, console: false, chat: false, play: false, watch: false };

  return {
    attach: function() {
      $rootScope.tabs = tabs;

      $rootScope.changeTab = function(tab) {
        tabs = _.reduce(tabs, function(obj, active, tab) {
          return _.extend(obj, { tab: activeTab === tab });
        }, {});
      };

      $rootScope.isActiveTab = function(tab) {
        return tab === activeTab();
      };
    },

    watchLogin: function() {
      if ($rootScope.isLoggedIn && $rootScope.isActiveTab("login")) {
        $rootScope.changeTab("chat");
      }
    }
  };

  function activeTab() {
    return _.invert(tabs)[true];
  }
}]);
