"use strict";

var gulp = require("gulp");

var browserify = require("browserify");
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require("gulp-uglify");

var sourcemaps = require("gulp-sourcemaps");
var watchify = require("watchify");

var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");

gulp.task("scripts", ["templates"], function(callback) {
  var bundler = browserify(watchify.args);

  bundler.add("./app/assets/js/application.js");

  if (global.watch) {
    bundler = watchify(bundler);
    bundler.on("update", bundle);
  }

  return bundle();

  function bundle() {
    var bundle = bundler
      .bundle()
      .on("error", function(err) {
        console.error("\nERROR:\n" + err.message);

        if (err.annotated) {
          console.log(err.annotated + "\n");
        }
      })
      .pipe(source("application.js"))
      .pipe(ngAnnotate());

    if (!global.watch) {
      bundle = bundle
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
    };

    return bundle.pipe(gulp.dest("public/assets"));
  }
});
