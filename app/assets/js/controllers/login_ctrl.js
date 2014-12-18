ficsClient.controller("LoginCtrl", ["$scope", "User", function($scope, User) {
  $scope.$watch(User.isLoggingIn, function(val) {
    $scope.isLoggingIn = val;
  });

  $scope.loginAsGuest = function() {
    User.login({ });
  };

  $scope.loginWithCredentials = User.login;
}]);
