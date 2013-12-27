ficsClient.filter("orderByCombinedRating", ["$filter", function($filter) {
  return function(games) {
    return $filter("orderBy")(games, function(game) {
      var whiteRating = parseInt(game.white.rating, 10);
      var blackRating = parseInt(game.black.rating, 10);

      if (_.isNaN(whiteRating) && _.isNaN(blackRating)) {
        return -1;
      } else if (_.isNaN(whiteRating) || _.isNaN(blackRating)) {
        return 0;
      } else {
        return whiteRating + blackRating;
      }
    }, true);
  };
}]);
