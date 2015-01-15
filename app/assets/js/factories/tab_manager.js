ficsClient.factory("TabManager", ["$timeout", function($timeout) {
  return function(scope) {
    return {
      attach: function() {
        scope.tabs = { login: true, console: false, chat: false, play: false, watch: false };

        scope.changeTab = function(activeTab) {
          scope.tabs = _.reduce(scope.tabs, function(obj, active, tab) {
            obj[tab] = tab === activeTab;

            return obj;
          }, {});
        };

        scope.isActiveTab = function(tab) {
          return tab === activeTab();
        };
      },

      watchLogin: function() {
        if (scope.isLoggedIn && scope.isActiveTab("login")) {
          // next run of the event loop, since the changing tabs
          // cause the last tab to become active by default
          $timeout(_.partial(_.bindAll(scope, "changeTab").changeTab, "chat"));
        }
      }
    }

    function activeTab() {
      return _.invert(scope.tabs)[true];
    }
  };
}]);
