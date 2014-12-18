ficsClient.controller("LoginCtrl", ["$scope", "User", function($scope, User) {
  $scope.isLoggingIn = false;

  $scope.loginAsGuest = function() {
    login({});
  };

  $scope.loginWithCredentials = login;

  function login(userData, remember) {
    $scope.isLoggingIn = true;
    User.login(userData, remember);
  }
}]);
