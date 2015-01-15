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

    if (gameData.update.position) {
      setGamePosition(game, gameData.update);
    } else if (gameData.update.message) {
      storeGameMessage(game, gameData.update);
    } else if (gameData.update.result) {
      setGameResult(game, gameData.update.result);
    } else {
      game.chat = { mode: "whisper" };
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

  return {
    activate: function() {
      Proxy.sendMessage("gameList");
    },

    games: function() { return games },

    watch: function(gameNumber) {
      var game = findGame(games, gameNumber);

      if (!_.include(watching, game)) {
        watching.push(game);
        Proxy.sendMessage("observe", { number: gameNumber });
      }
    },

    sendMessage: function(gameNumber) {
      return function(mode, message) {
        Proxy.sendMessage(mode, { number: gameNumber, message: message });
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

  function setGamePosition(game, metaData) {
    game.metaData = metaData;

    if (game.moves) {
      if (metaData.current.color === "W") {
        _.last(game.moves).push(metaData.move.algebraic);
      } else {
        game.moves.push([metaData.move.algebraic]);
      }
    } else {
      Proxy.sendMessage("moveList", { number: game.number });
    }

    if (!game.observers) {
      Proxy.sendMessage("observerList", { number: game.number });
    }
  }

  function storeGameMessage(game, message) {
    if (game.messages) {
      game.messages.push(message);
    } else {
      game.messages = [message];
    }
  }

  function setGameResult(game, result) {
    if (game.metaData) {
      game.metaData.result = result;
    } else {
      game.metaData = { result: result };
    }

    game.isComplete = true;
  }
}]);
