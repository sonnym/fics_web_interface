ficsClient.controller("LoginCtrl", ["$scope", "Proxy", function($scope, Proxy) {
  $scope.loginAsGuest = function() {
    Proxy.login({});
  };

  $scope.loginWithCredentials = function(userData) {
    Proxy.login(userData);
  };
}]);
