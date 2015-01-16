ficsClient.directive("userList", ["$parse", function($parse) {
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
    }
  };
}]);
