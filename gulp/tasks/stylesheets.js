var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("stylesheets", function () {
  gulp.src("app/assets/css/application.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/assets"));
});
