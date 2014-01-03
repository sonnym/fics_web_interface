ficsClient.controller("ObservationCtrl", ["$scope", "Observe", function($scope, Observe) {
  $scope.$watch(Observe.games, function(games) {
    $scope.games = games;
  });

  $scope.$watch(Observe.getWatching, function(games) {
    $scope.observations = games;
  });

  $scope.watch = function(gameNumber) {
    Observe.watch(gameNumber);
  };

  $scope.submitMessage = function(gameNumber, chat) {
    Observe.sendMessage(gameNumber, angular.copy(chat));
    chat.message = "";

    if ($event) {
      $event.preventDefault();
    }
  };

  $scope.stopWatching = function(gameNumber) {
    Observe.unWatch(gameNumber);
  };
}]);
