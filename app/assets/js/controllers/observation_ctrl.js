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

  $scope.checkForNewline = function(e, game) {
    if (e.which === 13) {
      $scope.submitMessage(game.number, game.chat);
    }
  };

  $scope.submitMessage = function(gameNumber, chat) {
    Observe.sendMessage(gameNumber, angular.copy(chat));
    chat.message = "";
  };

  $scope.stopWatching = function(gameNumber) {
    Observe.unWatch(gameNumber);
  };
}]);
