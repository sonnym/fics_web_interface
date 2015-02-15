"use strict";

var gulp = require("gulp");
var nodemon = require("gulp-nodemon");

gulp.task("server", function() {
  return nodemon({
    watch: ["lib/**/*"],
  });
});
