ficsClient.filter("paginationSubset", function() {
  return function(items, perPage, currentPage) {
    if (angular.isUndefined(items)) {
      return [];
    }

    return items.splice(((currentPage || 1) - 1) * perPage, perPage);
  }
});
