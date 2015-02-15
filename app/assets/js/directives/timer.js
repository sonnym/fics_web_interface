"use strict";

ficsClient.directive("timer", function($window, Setter) {
  return {
    restrict: "E",
    scope: { start: "=", tick: "=" },

    link: function(scope, element, attrs) {
      var tickInterval;

      scope.currentTime = scope.start;

      if (scope.tick) {
        startTick();
      }

      scope.$watch("start", Setter(scope)("currentTime"));

      scope.$watch("tick", function(newVal) {
        if (newVal) {
          startTick();
        } else {
          stopTick();
        }
      });

      scope.$on("destroy", stopTick);

      function startTick() {
        tickInterval = $window.setInterval(function() {
          scope.$apply(function() {
            if (scope.currentTime === 0) {
              return;
            }

            scope.currentTime--;
          });
        }, 1000);
      }

      function stopTick() {
        $window.clearInterval(tickInterval);
      }
    },

    template: "<h4>{{ currentTime | longTime }}</h4>"
  };
});
