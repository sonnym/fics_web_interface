ficsClient.controller("LoginCtrl", ["$scope", "Setter", "User", function($scope, Setter, User) {
  var scopeSetter = Setter($scope);

  $scope.$watch(User.isLoggingIn, scopeSetter("isLoggingIn"));
  $scope.$watch(User.loginFailure, scopeSetter("loginFailure"));

  $scope.loginAsGuest = function() {
    User.login({ });
  };

  $scope.loginWithCredentials = User.login;
}]);
