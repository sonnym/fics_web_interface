var ficsClient = angular.module("ficsClient", ["ui.bootstrap.buttons", "ui.bootstrap.dropdownToggle", "ui.bootstrap.pagination", "ui.bootstrap.tabs",
                                               "ui.keypress", "ui.scroll"]);

ficsClient.run(["$rootScope", "User", function($rootScope, User) {
  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);
  }, true);

  $rootScope.$watch(User.isGuest, function(isGuest) {
    $rootScope.isGuest = isGuest;
  });
}]);
