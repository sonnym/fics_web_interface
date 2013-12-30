ficsClient.factory("Observe", ["Proxy", function(Proxy) {
  var games;
  var watching = [];

  Proxy.registerMessage("gameList", function(data) {
    games = data;

    // setTimeout(function() { Proxy.sendMessage("gameList") }, 1000);
  });

  Proxy.registerMessage("observeUpdate", function(gameData) {
    var gameNumber = gameData.number;
    var game = findGame(watching, gameNumber);

    game.metaData = gameData.update;

    if (game.moves) {
      if (gameData.update.current.color === "W") {
        _.last(game.moves).push(gameData.update.move.algebraic);
      } else {
        game.moves.push([gameData.update.move.algebraic]);
      }
    } else {
      Proxy.sendMessage("moveList", { number: gameNumber });
    }

    if (!game.observers) {
      Proxy.sendMessage("observerList", { number: gameNumber });
    }
  });

  Proxy.registerMessage("moveList", function(gameData) {
    var game = findGame(watching, gameData.number);
    game.moves = gameData.moves;
  });

  Proxy.registerMessage("observerList", function(gameData) {
    var game = findGame(watching, gameData.number);
    game.observers = gameData.observers;
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

    unWatch: function(gameNumber) {
      unWatch(gameNumber);
      Proxy.sendMessage("unobserve", { number: gameNumber });
    },

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
