"use strict";

ficsClient.controller("AboutCtrl", function($scope, Setter, About) {
  var scopeSetter = Setter($scope);

  $scope.$watch(About.serverData, scopeSetter("serverData"));
});
