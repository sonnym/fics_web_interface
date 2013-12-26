function LoginCtrl($scope, Proxy) {
  $scope.loginAsGuest = function() {
    Proxy.login({});
  };

  $scope.loginWithCredentials = function(userData) {
    Proxy.login(userData);
  };
};
