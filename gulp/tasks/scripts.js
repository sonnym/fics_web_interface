var gulp = require("gulp");
var browserify = require("browserify");
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require("gulp-uglify");

var sourcemaps = require("gulp-sourcemaps");

var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");

gulp.task("scripts", ["templates"], function(callback) {
  return browserify({
    entries: ["./app/assets/js/application"],
    debug: true
  }).bundle()
    .on("error", function(err) {
      console.error("\nERROR:\n" + err.message);

      if (err.annotated) {
        console.log(err.annotated + "\n");
      }
    })
    .pipe(source("application.js"))
    .pipe(ngAnnotate())
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest("public/assets"));
});
