"use strict";

ficsClient.directive("loadingArea", function(Setter) {
  return {
    restrict: "E",
    transclude: true,
    replace: true,
    scope: { ensureFn: "&ensure" },

    link: function(scope) {
      scope.$watch(scope.ensureFn, Setter(scope)("displayContent"));
    },

    templateUrl: "template/loading_area.html"
  };
});
