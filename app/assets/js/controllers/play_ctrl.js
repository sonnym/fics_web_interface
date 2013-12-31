ficsClient.controller("PlayCtrl", ["$scope", "Play", function($scope, Play) {
  $scope.sought = Play.getSought;
}]);
