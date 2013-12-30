ficsClient.directive("board", function() {
  var pieces = { "K": "♔", "Q": "♕", "R": "♖", "B": "♗", "N": "♘", "P": "♙"
               , "k": "♚", "q": "♛", "r": "♜", "b": "♝", "n": "♞", "p": "♟"
               };

  return {
    restrict: "E",
    scope: { fen: "=", white: "=", black: "=", move: "=", time: "=" },

    link: function(scope, element, attrs) {
      scope.$watch("fen", function(newVal, oldVal) {
        if (!newVal || newVal === oldVal) {
          return;
        }

        scope.boardState = fen2array(newVal);
      });

      scope.ascii2unicode = function(str) {
        return pieces[str] || "";
      };
    },

    templateUrl: "/board.html"
  };

  function fen2array(fen) {
    return _.map(fen.split("/"), function(rank) {
      return _.flatten(_.map(rank.split(""), function(unit) {
        var number = parseInt(unit, 10);

        if (_.isNaN(number)) {
          return unit;
        } else {
          return Array(number).join(".").split(".");
        }
      }));
    });
  }
});

ficsClient.directive("timer", ["$window", function($window) {
  return {
    restrict: "E",
    scope: { start: "=", tick: "=" },

    link: function(scope, element, attrs) {
      var timeoutId;

      scope.$watch("start", function(newVal) {
        scope.currentTime = newVal;
      });

      scope.$watch("tick", function(newVal) {
        if (newVal) {
          timeoutId = $window.setTimeout(function() {
            scope.currentTime -= 1;
          }, 1000);
        } else {
          clearTimeout();
        }
      });

      scope.$on("destroy", clearTimeout);

      function clearTimeout() {
        $window.clearTimeout(timeoutId);
      }
    },

    template: "<h4>{{currentTime | longTime}}</h4>"
  };
}]);
