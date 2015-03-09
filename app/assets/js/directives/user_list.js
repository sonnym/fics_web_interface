"use strict";

ficsClient.directive("userList", function($parse, Setter, Chat) {
  return {
    restict: "E",
    templateUrl: "template/user_list.html",

    scope: { "extraAttributes": "=?" },

    link: function(scope, _, attr) {
      var parsedUsersExpression = $parse(attr.users);

      scope.$watch(function() {
        return parsedUsersExpression(scope.$parent);
      }, Setter(scope)("displayUsers"), true);

      scope.startPrivateMessage = Chat.startPrivateMessage;
    }
  };
});
