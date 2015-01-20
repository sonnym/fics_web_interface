ficsClient.controller("ChatCtrl", ["$scope", "Setter", "Chat", function($scope, Setter, Chat) {
  var scopeSetter = Setter($scope);

  $scope.$watch(Chat.users, scopeSetter("users"));
  $scope.$watch(Chat.channels, scopeSetter("channels"));
  $scope.$watch(Chat.subscribedChannels, scopeSetter("subscribedChannels"));
  $scope.$watch(Chat.messages, scopeSetter("messages"));

  $scope.joinChannel = Chat.joinChannel;
  $scope.leaveChannel = Chat.leaveChannel;

  $scope.closePrivateMessage = Chat.closePrivateMessage;

  $scope.globalModes = ["it"];

  $scope.shout = Chat.shout;
  $scope.sendMessage = Chat.sendMessage;

  $scope.channelName = function(channelNumber) {
    return _.detect($scope.channels, function(channel) {
      return channelNumber === channel.number;
    }).name;
  };
}]);
