var gulp = require("gulp");
var browserify = require("browserify");

var source = require("vinyl-source-stream");

gulp.task("browserify", function(callback) {
  var bundler = browserify({
    entries: ["./app/assets/js/application"],
    debug: true
  });

  return bundle();

  function bundle() {
    return bundler
      .bundle()
      .pipe(source("application.js"))
      .pipe(gulp.dest("public/assets"));
  }
});
