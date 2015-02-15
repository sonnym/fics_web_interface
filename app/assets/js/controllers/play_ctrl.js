"use strict";

ficsClient.controller("PlayCtrl", function($scope, Setter, Play) {
  $scope.$watch(Play.getSought, Setter($scope)("sought"));
});
