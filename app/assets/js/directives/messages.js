ficsClient.directive("messages", function() {
  return {
    restrict: "E",
    scope: { messages: "=", sendFn: "&send", allowedModes: "=?" },

    link: function(scope) {
      scope.message = "";

      if (scope.allowedModes) {
        scope.mode = "";

        if (scope.allowedModes.length > 1) {
          scope.mode = scope.allowedModes[0];
        }
      }

      scope.sendMessage = function() {
        var opts = { message: scope.message };

        if (_.any(scope.allowedModes) && scope.mode) {
          opts = _.extend(opts, { mode: scope.mode });
        }

        scope.sendFn(opts);

        scope.message = "";
      };

      scope.isModeAllowed = function(mode) {
        return _.contains(scope.allowedModes, mode);
      }
    },

    templateUrl: "/template/messages.html"
  };
});
