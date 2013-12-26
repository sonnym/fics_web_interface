ficsClient.controller("ChatCtrl", ["$scope", "Chat", function($scope, Chat) {
  $scope.channels = Chat.channels;
  $scope.users = Chat.users;
}]);
