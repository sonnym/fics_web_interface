ficsClient.directive("board", function() {
  var pieces = { "K": "♔", "Q": "♕", "R": "♖", "B": "♗", "N": "♘", "P": "♙"
               , "k": "♚", "q": "♛", "r": "♜", "b": "♝", "n": "♞", "p": "♟"
               };

  return {
    restrict: "E",
    scope: { fen: "=", white: "=", black: "=", move: "=", time: "=", complete: "=" },

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

    templateUrl: "template/board.html"
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
