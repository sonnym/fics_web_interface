ficsClient.factory("Observe", function() {
  var games;
  var watching = [];

  return {
    games: function() { return games },
    setGames: function(val) { games = val },

    watch: function(gameNumber) {
      var game = _.detect(games, function(game) {
        return gameNumber === game.number;
      });

      watching = _.union(watching, [game]);
    },

    unWatch: function(gameNumber) {
      watching = _.reject(watching, function(game) {
        return gameNumber === game.number;
      });
    },

    getWatching: function() { return watching }
  }
});
