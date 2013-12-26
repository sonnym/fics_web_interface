function ChatCtrl($scope, Chat) {
  $scope.channels = Chat.channels;
  $scope.users = Chat.users;
}
