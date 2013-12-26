ficsClient.factory("Observe", function() {
  var games;
  var watching = [];

  return {
    games: function() { return games },
    setGames: function(val) { games = val },

    watch: function(gameNumber) {
      if (watching.indexOf(gameNumber) === -1) {
        watching.push(gameNumber);
      }
    },
    getWatching: function() { return watching }
  }
});
