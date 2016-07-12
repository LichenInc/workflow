var gulp = require('gulp');
var path = require('path');

var configs      = gulp_require('config');

var sizereport      = lazy_require('gulp-sizereport');

gulp.task('dist:sizereport', function() {
  return gulp.src(path.join(configs.dirs.dist, configs.dirs.assets, '**/*'))
    .pipe(sizereport()({
      gzip: true
    }));
});
