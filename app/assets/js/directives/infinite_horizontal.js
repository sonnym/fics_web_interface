ficsClient.directive("infiniteHorizontal", function() {
  return {
    restrict: "E",
    replace: true,
    transclude: true,

    link: function(scope, element, attrs, ctrl, transcludeFn) {
      var scrollContainer = element.find("ul");
      var infiniteInner = scrollContainer.parent();

      scope.showControls = false;
      scope.$watch(isOverflowing, function(val) {
        scope.showControls = val;

        if (val) {
          infiniteInner.css({ width: (element[0].clientWidth - 75) + "px" });
        } else {
          infiniteInner.css({ width: "" });
        }
      });

      scope.scrollLeft = function() {
        var newVal = Math.min(0, scrollContainer[0].offsetLeft + 25);
        scrollContainer.css({ left: newVal + "px" });
      };

      scope.scrollRight = function() {
        var newVal = Math.max(-widthDifference(), scrollContainer[0].offsetLeft - 25);
        scrollContainer.css({ left: newVal + "px" });
      };

      function isOverflowing() {
        return widthDifference() > 0;
      }

      function widthDifference() {
        return scrollContainer[0].clientWidth - infiniteInner[0].clientWidth;
      }
    },

    templateUrl: "/infinite_horizontal.html"
  };
});
