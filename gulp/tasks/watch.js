var gulp = require("gulp");

gulp.task("watch", function() {
  gulp.watch("app/assets/js/**/*.*", ["scripts"]);
  gulp.watch("app/assets/css/**/*.*", ["stylesheets"]);
  gulp.watch("app/assets/templates/**/*.*", ["templates"]);
});
