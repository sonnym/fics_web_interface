ficsClient.filter("orderByCombinedRating", function($filter) {
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
});

ficsClient.filter("orderByNumberString", function($filter) {
  return function(objects, property) {
    if (property) {
      var orderFn = function(object) {
        return parseInt(object[property], 10);
      };
    } else {
      var orderFn = function(numberString) {
        return parseInt(numberString, 10);
      };
    }

    return $filter("orderBy")(objects, orderFn);
  };
});
