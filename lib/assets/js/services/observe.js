ficsClient.factory("Observe", ["Proxy", function(Proxy) {
  var games;
  var watching = [];

  Proxy.registerMessage("gameList", function(data) {
    games = data;
  });

  Proxy.registerMessage("observeUpdate", function(gameData) {
    var gameNumber = gameData.number;
    var game = findGame(watching, gameNumber);

    game.metaData = { position: gameData.update.position
                    , currentMove: (gameData.update.color === "W") ? "B" : "W"
                    };
  });

  Proxy.registerMessage("observeEnd", unWatch);

  return {
    games: function() { return games },

    watch: function(gameNumber) {
      var game = findGame(games, gameNumber);

      if (!_.include(watching, game)) {
        watching.push(game);
        Proxy.sendMessage("observe", { number: gameNumber });
      }
    },

    unWatch: unWatch,

    getWatching: function() { return watching }
  }

  function findGame(collection, gameNumber) {
    return _.detect(collection, function(game) {
      return gameNumber === game.number;
    });
  }

  function unWatch(gameNumber) {
    watching = _.reject(watching, function(game) {
      return gameNumber === game.number;
    });
  }
}]);
