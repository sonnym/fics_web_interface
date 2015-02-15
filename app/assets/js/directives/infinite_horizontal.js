"use strict";

ficsClient.directive("infiniteHorizontal", function($interval, $timeout, $window) {
  return {
    restrict: "E",
    replace: true,
    transclude: true,

    link: function(scope, element) {
      var interval;

      var scrollContainer = element.find("ul");
      var infiniteInner = scrollContainer.parent();

      scope.showControls = false;
      scope.$watch(isOverflowing, setupControls);

      angular.element($window).on("resize", _.debounce(function() {
        $timeout(function() {
          setupControls(isOverflowing());
        });
      }, 100));

      scope.startLeftScroll = function() {
        interval = $interval(scrollLeft, 10)
      };

      scope.startRightScroll = function() {
        interval = $interval(scrollRight, 10)
      };

      scope.stopScrolling = function() {
        $interval.cancel(interval);
      };

      function setupControls(val) {
        scope.showControls = val;

        if (val) {
          infiniteInner.css({ width: (element[0].clientWidth - 75) + "px" });
        } else {
          infiniteInner.css({ width: "" });
          scrollContainer.css({ left: "0px" });
        }
      }

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

    templateUrl: "template/infinite_horizontal.html"
  };
});
