ficsClient.factory("FiniteArray", function() {
  return FiniteArray;

  function FiniteArray(maxLength) {
    if (_.isArray(this)) {
      var array = this;
    } else {
      var array = Array.apply(Object.create(Array.prototype));
    }

    array.maxLength = maxLength;

    _.each(["concat", "push", "splice", "unshift"], function(methodName) {
      array[methodName] = function() {
        var result = Array.prototype[methodName].apply(array, arguments);

        if (_.isArray(result)) {
          return limit.call(fromArray(result));
        } else {
          return _.tap(result, _.partial(limit.call, array));
        }
      };
    });

    return array;

    function fromArray(array) {
      return FiniteArray.call(array, maxLength);
    }
  };

  function limit() {
    if (this.length <= this.maxLength) {
      return this;
    } else {
      return this.slice(this.maxLength - this.length);
    }
  }
});
