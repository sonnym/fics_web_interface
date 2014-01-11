ficsClient.factory("TabManager", ["$rootScope", function($rootScope) {
  var activeTab = "login";

  return {
    attach: function() {
      $rootScope.changeTab = function(tab) {
        activeTab = tab;
      };

      $rootScope.isActiveTab = function(tab) {
        return tab === activeTab;
      };
    },

    watchLogin: function() {
      if ($rootScope.isLoggedIn && $rootScope.isActiveTab("login")) {
        $rootScope.changeTab("chat");
      }
    }
  };
}]);
