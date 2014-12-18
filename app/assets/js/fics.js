var ficsClient = angular.module("ficsClient", [
  "ui.bootstrap.buttons",
  "ui.bootstrap.pagination",
  "ui.bootstrap.tabs",
  "ui.keypress",
  "ui.scroll",
  "luegg.directives"
]);

ficsClient.run(["$rootScope", "TabManager", "User", function($rootScope, TabManager, User) {
  TabManager.attach();

  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);

    TabManager.watchLogin();
  }, true);

  $rootScope.$watch(User.isGuest, function(isGuest) {
    $rootScope.isGuest = isGuest;
  });
}]);
