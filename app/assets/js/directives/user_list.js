ficsClient.directive("userList", ["$parse", "Setter", "Chat", function($parse, Setter, Chat) {
  return {
    restict: "E",
    templateUrl: "template/user_list.html",

    link: function(scope, _, attr) {
      var parsedUsersExpression = $parse(attr.users);

      scope.$watch(function() {
        return parsedUsersExpression(scope);
      }, Setter(scope)("displayUsers"), true);

      scope.startPrivateMessage = Chat.startPrivateMessage;
    }
  };
}]);
