ficsClient.controller("PlayCtrl", ["$scope", "Play", function($scope, Play) {
  $scope.$watch(Play.getSought, function(sought) {
    $scope.sought = sought;
  });
}]);
