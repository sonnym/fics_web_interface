ficsClient.controller("ChatCtrl", ["$scope", "Chat", function($scope, Chat) {
  $scope.users = Chat.users;

  $scope.channels = Chat.channels;
  $scope.subscribedChannels = Chat.subscribedChannels;

  $scope.channelName = function(channelNumber) {
    return _.detect($scope.channels(), function(channel) {
      return channelNumber === channel.number;
    }).name;
  };
}]);
