"use strict";

ficsClient.directive("scaleText", function($window) {
  return {
    restrict: "A",

    link: function(scope, element) {
      scaleText();

      scope.$watch(function() { return element[0].clientHeight }, scaleText);
      angular.element($window).on("resize", _.debounce(scaleText, 100));

      function scaleText() {
        element.css({
          fontSize: (0.95 * element[0].clientHeight).toString() + "px"
        });
      }
    }
  };
});
