var gulp = require("gulp");

gulp.task("watch", function() {
  gulp.watch("app/assets/js/**/*.js", ["scripts"]);
  gulp.watch("app/assets/css/**/*.css", ["stylesheets"]);
  gulp.watch("app/assets/templates/**/*.html", ["templates"]);
});
