ficsClient.filter("paginationSubset", function() {
  return function(items, perPage, currentPage) {
    return items.splice(((currentPage || 1) - 1) * perPage, perPage);
  }
});
