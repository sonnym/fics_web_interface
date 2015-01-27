var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function () {
  gulp.src("app/assets/css/application.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/assets"));
});
