"use strict";

var path = require("path");

var _ = require("underscore");

var ficsConstants = require("fics").constants;

module.exports.listen = function(app, rootPath) {
  app.get("/", function(req, res) {
    res.render(path.join(rootPath, "app", "templates", "index.ejs"), {
      ficsConstants: ficsConstants,
      enableConsole: !_.isUndefined(req.query.debug)
    });
  });
};
