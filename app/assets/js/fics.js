var ficsClient = angular.module("ficsClient", [
  "ngCookies",
  "ui.bootstrap.buttons",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.pagination",
  "ui.bootstrap.tabs",
  "ui.keypress",
  "ui.scroll",
  "luegg.directives"
]);

ficsClient.run(["$rootScope", "TabManager", "User", "Chat", "Observe", "Play", function($rootScope, TabManager, User, Chat, Observe, Play) {
  var tabManager = new TabManager({
    login: { active: true },
    chat: { active: false, activate: Chat.activate, notify: Chat.notify },
    play: { active: false, activate: Play.activate },
    observe: { active: false, activate: Observe.activate }
  });

  $rootScope.tabs = tabManager.tabs;

  $rootScope.$watch(User.getUsername, function(username) {
    $rootScope.isLoggedIn = angular.isDefined(username);

    if ($rootScope.isLoggedIn && tabManager.isActiveTab("login")) {
      tabManager.tabs["chat"].active = true;
    }
  }, true);

  $rootScope.$watch(User.isGuest, function(isGuest) {
    $rootScope.isGuest = isGuest;
  });
}]);
