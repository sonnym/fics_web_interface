ficsClient.directive("userList", ["$parse", "Chat", function($parse, Chat) {
  return {
    restict: "E",
    templateUrl: "/user_list.html",

    link: function(scope, _, attr) {
      var parsedUsersExpression = $parse(attr.users);

      scope.$watch(function() {
        return parsedUsersExpression(scope);
      }, function(val) {
        scope.displayUsers = val;
      }, true);


      scope.startPrivateMessage = Chat.startPrivateMessage;
    }
  };
}]);
