var gulp = require("gulp");
var browserify = require("browserify");
var ngAnnotate = require('gulp-ng-annotate');

var source = require("vinyl-source-stream");

gulp.task("scripts", ["templates"], function(callback) {
  return browserify({
    entries: ["./app/assets/js/application"],
    debug: true
  }).bundle()
    .on("error", function(err) {
      console.error("\nERROR:\n" + err.message);
    })
    .pipe(source("application.js"))
    .pipe(ngAnnotate())
    .pipe(gulp.dest("public/assets"));
});
