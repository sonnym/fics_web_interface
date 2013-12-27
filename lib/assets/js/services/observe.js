ficsClient.factory("Observe", function() {
  var games;
  var watching = [];

  return {
    games: function() { return games },
    setGames: function(val) { games = val },

    watch: function(gameNumber) {
      var game = findGame(games, gameNumber);

      var alreadyWatching = _.include(watching, game);
      if (!alreadyWatching) {
        watching.push(game);
      }

      return !alreadyWatching;
    },

    update: function(gameData) {
      var gameNumber = gameData.number;
      var game = findGame(watching, gameNumber);

      game.metaData = { position: gameData.update.position
                      , currentMove: (gameData.update.move === "W") ? "B" : "W"
                      };
    },

    unWatch: function(gameNumber) {
      watching = _.reject(watching, function(game) {
        return gameNumber === game.number;
      });
    },

    getWatching: function() { return watching }
  }

  function findGame(collection, gameNumber) {
    return _.detect(collection, function(game) {
      return gameNumber === game.number;
    });
  }
});
