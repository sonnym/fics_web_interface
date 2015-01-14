ficsClient.controller("LoginCtrl", ["$scope", "User", function($scope, User) {
  $scope.$watch(User.isLoggingIn, function(val) {
    $scope.isLoggingIn = val;
  });

  $scope.$watch(User.loginFailure, function(val) {
    $scope.loginFailure = val;
  });

  $scope.loginAsGuest = function() {
    User.login({ });
  };

  $scope.loginWithCredentials = User.login;
}]);
