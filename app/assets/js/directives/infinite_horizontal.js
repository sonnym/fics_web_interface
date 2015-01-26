ficsClient.directive("infiniteHorizontal", ["$interval", function($interval) {
  return {
    restrict: "E",
    replace: true,
    transclude: true,

    link: function(scope, element, attrs, ctrl, transcludeFn) {
      var interval;

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

      scope.startLeftScroll = function() {
        interval = $interval(scrollLeft, 10)
      };

      scope.startRightScroll = function() {
        interval = $interval(scrollRight, 10)
      };

      scope.stopScrolling = function() {
        $interval.cancel(interval);
      };

      function scrollLeft() {
        var newVal = Math.min(0, scrollContainer[0].offsetLeft + 5);
        scrollContainer.css({ left: newVal + "px" });
      };

      function scrollRight() {
        var newVal = Math.max(-widthDifference(), scrollContainer[0].offsetLeft - 5);
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
}]);
