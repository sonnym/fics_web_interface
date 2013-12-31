ficsClient.controller("LoginCtrl", ["$scope", "User", function($scope, User) {
  $scope.isLoggingIn = false;

  $scope.loginAsGuest = function() {
    login({});
  };

  $scope.loginWithCredentials = function(userData) {
    login(userData);
  };

  function login(userData) {
    $scope.isLoggingIn = true;
    User.login(userData);
  }
}]);
