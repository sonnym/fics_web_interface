ficsClient.directive("loadingArea", function() {
  return {
    restrict: "E",
    transclude: true,
    replace: true,
    scope: { ensureFn: "&ensure" },

    link: function(scope, element, _, _, transcludeFn) {
      scope.$watch(scope.ensureFn, function(val) {
        scope.displayContent = val;
      });
    },

    templateUrl: "/loading_area.html"
  };
});
