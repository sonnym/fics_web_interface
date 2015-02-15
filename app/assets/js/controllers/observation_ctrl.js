"use strict";

ficsClient.controller("ObservationCtrl", function($scope, Setter, Observe) {
  var scopeSetter = Setter($scope);

  $scope.$watch(Observe.games, scopeSetter("games"));
  $scope.$watch(Observe.getWatching, scopeSetter("observations"));

  $scope.watch = function(gameNumber) {
    Observe.watch(gameNumber);
  };

  $scope.stopWatching = function(gameNumber) {
    Observe.unWatch(gameNumber);
  };

  $scope.allowedModes = ["whisper", "kibitz"];
  $scope.sendMessage = Observe.sendMessage;
});
