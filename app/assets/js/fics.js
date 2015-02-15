"use strict";

global.ficsClient = angular.module("ficsClient", [
  "ngCookies",
  "ui.bootstrap.accordion",
  "ui.bootstrap.buttons",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.pagination",
  "ui.bootstrap.tabs",
  "ui.keypress",
  "ui.scroll",
  "luegg.directives",
  "templates"
]);

ficsClient.run(function($rootScope, Setter, TabManager, User, Chat, Observe, Play) {
  var tabManager = new TabManager({
    login: { active: true },
    chat: _.extend({ active: false }, Chat.notifier),
    play: _.extend({ active: false }, Play.notifier),
    observe: _.extend({ active: false }, Observe.notifier),
    console: { active: false },
    about: { active: false }
  });

  $rootScope.tabs = tabManager.tabs;

  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);

    if ($rootScope.isLoggedIn && tabManager.isActiveTab("login")) {
      tabManager.tabs["chat"].active = true;
    }
  });

  $rootScope.$watch(User.isGuest, Setter($rootScope)("isGuest"));
});
