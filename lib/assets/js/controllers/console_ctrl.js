ficsClient.controller("ConsoleCtrl", ["$scope", "Console", function($scope, Console) {
  $scope.output = Console.get;
}]);
