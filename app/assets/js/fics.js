var ficsClient = angular.module("ficsClient", ["ui.bootstrap.buttons", "ui.bootstrap.pagination", "ui.bootstrap.tabs"]);

ficsClient.run(["$rootScope", "User", function($rootScope, User) {
  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);
  }, true);

  $rootScope.isGuest = User.isGuest;
}]);
