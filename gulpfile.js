const gulp = require('gulp') ;
const stylus = require('gulp-stylus')

gulp.task('css', function () {
    return gulp.src('stylus/index.styl')
    .pipe(stylus())
    .pipe(gulp.dest('static/css/'));
});