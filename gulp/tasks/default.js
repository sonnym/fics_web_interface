"use strict";

var gulp = require("gulp");

gulp.task("default", ["build", "watch", "server"], function() {
  global.watch = true;
});
