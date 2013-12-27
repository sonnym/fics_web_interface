ficsClient.controller("ObservationCtrl", ["$scope", "Observe", "Proxy", function($scope, Observe, Proxy) {
  $scope.games = Observe.games;
  $scope.observations = Observe.getWatching;

  $scope.watch = function(gameNumber) {
    if (Observe.watch(gameNumber)) {
      Proxy.observe({ number: gameNumber });
    };
  };

  $scope.stopWatching = function(gameNumber) {
    Observe.unWatch(gameNumber);
  };
}]);
