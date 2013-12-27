ficsClient.directive("soughtGraph", function() {
  return {
    restrict: "E",
    scope: { "seeks": "=",
             "display": "="
           },

    link: function(scope, element, attrs) {
      var display = false;
      var seeks = [];

      var svg = d3.select(element[0]).append("svg");

      scope.$watch("display", function(newVal) {
        display = newVal;
        redraw();
      });

      scope.$watch("seeks", function (newVal) {
        seeks = newVal || [];
        redraw();
      });

      function redraw() {
        if (!display || seeks.length === 0) {
          return;
        }

        nv.addGraph(function() {
          var chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true)
                        .color(d3.scale.category10().range());

          svg.datum(formatSeeks(seeks))
             .transition().duration(500)
             .call(chart);


          return chart;
        });
      }
    }
  };

  function formatSeeks(seeks) {
    var random = d3.random.normal();

    return _.reduce(_.groupBy(seeks, "type"), function(memo, seeks, gameType) {
      var values = _.map(seeks, function(seek) {
        return { x: _.isNaN(parseInt(seek.user.rating, 10)) ? 0 : seek.user.rating
               , y: seek.time.initial
               , size: Math.random()
               };
      });

      return _.union(memo, [{ key: gameType, values: values }]);
    }, []);
  }
});
