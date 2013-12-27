ficsClient.controller("LoginCtrl", ["$scope", "User", function($scope, User) {
  $scope.loginAsGuest = function() {
    User.login({});
  };

  $scope.loginWithCredentials = function(userData) {
    User.login(userData);
  };
}]);
