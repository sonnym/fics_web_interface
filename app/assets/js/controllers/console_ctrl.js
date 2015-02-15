ficsClient.controller("ConsoleCtrl", function($scope, Console) {
  $scope.$watch(Console.get, function(output) {
    $scope.output = output;
  }, true);
});
