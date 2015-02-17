"use strict";

ficsClient.factory("About", function(Proxy) {
  var serverData;

  Proxy.registerMessage("serverData", function(data) {
    serverData = data;
  });

  return {
    notifier: {
      activate: queryData,
      update: queryData
    },

    serverData: function() { return serverData }
  };

  function queryData() {
    Proxy.sendMessage("serverData");
  }
});
