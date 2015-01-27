var gulp = require("gulp");
var templateCache = require("gulp-angular-templatecache");

var browserify = require("browserify");
var source = require("vinyl-source-stream");

gulp.task("templates", function () {
  return gulp
    .src("app/assets/templates/**/*.html")
    .pipe(templateCache("templates.js", {
      root: "template",
      standalone: true,
    }))
    .pipe(gulp.dest("app/assets/js/"));
});
