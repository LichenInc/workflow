var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');

gulp.task('copy:scripts:app', function () {
  return gulp.src('**/*.js', { cwd: path.join(configs.dirs.app, configs.dirs.scripts) })
    .pipe(gulp.dest(path.join(configs.dirs.tmp, configs.dirs.assets)))
});

gulp.task('copy:scripts:lib', function () {
  return gulp.src('**/*.js', { cwd: path.join(configs.dirs.lib, configs.dirs.scripts) })
    .pipe(gulp.dest(path.join(configs.dirs.tmp, configs.dirs.assets)))
});

gulp.task('copy:scripts:vendor', function () {
  return gulp.src('**/*.js', { cwd: path.join(configs.dirs.vendor, configs.dirs.scripts) })
    .pipe(gulp.dest(path.join(configs.dirs.tmp, configs.dirs.assets)))
});

gulp.task('copy:scripts:bower_components', function () {
  return gulp.src('**/*.js', { cwd: path.join(configs.dirs.bower_components) })
    .pipe(gulp.dest(path.join(configs.dirs.tmp, configs.dirs.assets)))
});

gulp.task('copy:scripts', function(cb){
  runSequence(['copy:scripts:app', 'copy:scripts:lib', 'copy:scripts:vendor', 'copy:scripts:bower_components'],
    cb);
});

gulp.task('copy:fonts', function () {
  return gulp.src('**/*', { cwd: path.join(configs.dirs.app, configs.dirs.fonts) })
    .pipe(gulp.dest(path.join(configs.dirs.tmp, configs.dirs.assets)))
});
