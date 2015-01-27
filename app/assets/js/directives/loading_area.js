ficsClient.directive("loadingArea", ["Setter", function(Setter) {
  return {
    restrict: "E",
    transclude: true,
    replace: true,
    scope: { ensureFn: "&ensure" },

    link: function(scope, element, _, _, transcludeFn) {
      scope.$watch(scope.ensureFn, Setter(scope)("displayContent"));
    },

    templateUrl: "/template/loading_area.html"
  };
}]);
