var ficsClient = angular.module("ficsClient", ["ui.bootstrap.tabs"]);

ficsClient.run(["$rootScope", "User", function($rootScope, User) {
  $rootScope.isLoggedIn = function() {
    return angular.isDefined(User.getUsername());
  }
}]);
