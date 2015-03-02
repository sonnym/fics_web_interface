"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');

gulp.task("stylesheets", function () {
  gulp.src("app/assets/css/application.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", function(err) {
      console.error("\nERROR:\n" + err.message);
      console.log(err);
      console.log();
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("public/assets"));
});
