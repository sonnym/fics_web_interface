var ficsClient = angular.module("ficsClient", ["ui.bootstrap.buttons", "ui.bootstrap.pagination", "ui.bootstrap.tabs"]);

ficsClient.run(["$rootScope", "User", function($rootScope, User) {
  $rootScope.isLoggedIn = function() {
    return angular.isDefined(User.getUsername());
  }

  $rootScope.isGuest = User.isGuest;
}]);
