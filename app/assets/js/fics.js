var ficsClient = angular.module("ficsClient", [
  "ngCookies",
  "ui.bootstrap.buttons",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.pagination",
  "ui.bootstrap.tabs",
  "ui.keypress",
  "ui.scroll",
  "luegg.directives"
]);

// only include play as a dependency temporarily to make it register its messages
ficsClient.run(["$rootScope", "TabManager", "User", "Play", function($rootScope, TabManager, User) {
  TabManager.attach();

  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);

    TabManager.watchLogin();
  }, true);

  $rootScope.$watch(User.isGuest, function(isGuest) {
    $rootScope.isGuest = isGuest;
  });
}]);
