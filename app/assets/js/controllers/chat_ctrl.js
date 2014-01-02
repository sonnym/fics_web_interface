ficsClient.controller("ChatCtrl", ["$scope", "Chat", function($scope, Chat) {
  $scope.$watch(Chat.users, function(users) {
    $scope.users = users;
  });

  $scope.$watch(Chat.channels, function(channels) {
    $scope.channels = channels;
  });

  $scope.$watch(Chat.subscribedChannels, function(channels) {
    $scope.subscribedChannels = channels;
  });

  $scope.$watch(Chat.messages, function(messages) {
    $scope.messages = messages;
  });

  $scope.joinChannel = Chat.joinChannel;
  $scope.leaveChannel = Chat.leaveChannel;

  $scope.startPrivateMessage = Chat.startPrivateMessage;
  $scope.closePrivateMessage = Chat.closePrivateMessage;

  $scope.sendMessage = Chat.sendMessage;

  $scope.channelName = function(channelNumber) {
    return _.detect($scope.channels, function(channel) {
      return channelNumber === channel.number;
    }).name;
  };
}]);
