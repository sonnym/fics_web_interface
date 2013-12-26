ficsClient.controller("ObservationCtrl", ["$scope", "Observe", function($scope, Observe) {
  $scope.games = Observe.games;
  $scope.observations = Observe.getWatching;

  $scope.watch = function(gameNumber) {
    Observe.watch(gameNumber);
  };
}]);
