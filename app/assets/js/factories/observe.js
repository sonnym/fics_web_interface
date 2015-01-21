ficsClient.factory("Observe", ["Proxy", "Game", function(Proxy, Game) {
  var games;
  var watching = [];

  Proxy.registerMessage("gameList", function(data) {
    games = data;
  });

  Proxy.registerMessage("observeUpdate", function(gameData) {
    var gameNumber = gameData.number;
    var game = findGameByNumber(watching, gameNumber);

    game.update(gameData);
  });

  Proxy.registerMessage("moveList", function(gameData) {
    var game = findGameByNumber(watching, gameData.number);
    game.moves = gameData.moves;
  });

  Proxy.registerMessage("observerList", function(gameData) {
    var game = findGameByNumber(watching, gameData.number);
    game.observers = _.map(gameData.observers, function(name) {
      return { name: name };
    });
  });

  return {
    notifier: {
      activate: function() {
        Proxy.sendMessage("gameList");
      },

      notify: function() {
        return _.any(watching, function (game) {
          return game.notify();
        });
      }
    },

    games: function() { return games },

    watch: function(gameNumber) {
      var game = findGameByNumber(games, gameNumber);

      if (_.isUndefined(findGameByNumber(watching, game))) {
        watching.push(new Game(game));
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

  function findGameByNumber(collection, gameNumber) {
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
