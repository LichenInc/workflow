var gulp = require('gulp');
var path = require('path');

var configs      = gulp_require('config');

var RevAll      = lazy_require('gulp-rev-all');

gulp.task('dist:rev', function() {
  var revAll = new RevAll()({
    dontSearchFile: ['.js']
  });

  return gulp.src(path.join(configs.dirs.dist, '**/*'))
    .pipe(revAll.revision())
    .pipe(gulp.dest(path.join(configs.dirs.dist)))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(path.join(configs.dirs.dist)))
    .pipe(revAll.versionFile())
    .pipe(gulp.dest(path.join(configs.dirs.dist)))
});
