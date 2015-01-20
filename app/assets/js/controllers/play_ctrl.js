ficsClient.controller("PlayCtrl", ["$scope", "Setter", "Play", function($scope, Setter, Play) {
  $scope.$watch(Play.getSought, Setter($scope)("sought"));
}]);
