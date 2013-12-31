ficsClient.filter("longTime", ["$filter", function($filter) {
  return function(seconds) {
    seconds = parseInt(seconds, 10);

    if (_.isNaN(seconds)) {
      return "00:00:00";
    }

    var hours = 0;
    var minutes = Math.floor(seconds / 60);

    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60
    }

    seconds = seconds % 60;

    return _.map([hours, minutes, seconds], function(unit) {
      unit = unit.toString();

      if (unit.length === 1) {
        unit = "0" + unit;
      }

      return unit;
    }).join(":");
  };
}]);
