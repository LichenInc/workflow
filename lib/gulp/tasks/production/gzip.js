var gulp = require('gulp');
var path = require('path');

var configs      = gulp_require('config');

var gzip      = lazy_require('gulp-gzip');
var filter    = lazy_require('gulp-filter');
var size      = lazy_require('gulp-size');

gulp.task('dist:gzip', function() {
  return gulp.src(path.join(configs.dirs.dist, '**/*'))
    .pipe(filter()([
      '**/*.js',
      '**/*.css',
      '**/*.json',
      '**/*.html',
      '**/*.svg',
      '**/*.eot',
      '**/*.ttf',
      '**/*.otf',
      '**/*.woff',
      '**/*.woff2',
      '**/*.xml'
    ]))
    .pipe(gzip()())
    .pipe(gulp.dest(path.join(configs.dirs.dist)))
    //.pipe(size()({showFiles: true, title: 'gzip'}));
});
