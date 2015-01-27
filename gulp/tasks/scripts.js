var gulp = require("gulp");
var browserify = require("browserify");

var source = require("vinyl-source-stream");

gulp.task("scripts", function(callback) {
  return browserify({
    entries: ["./app/assets/js/application"],
    debug: true
  }).bundle()
    .pipe(source("application.js"))
    .pipe(gulp.dest("public/assets"));
});
