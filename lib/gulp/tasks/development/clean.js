var gulp = require('gulp');
var path = require('path');

var configs      = gulp_require('config');

var del         = lazy_require('del');
var cached      = lazy_require('gulp-cached');

gulp.task('clean:caches', function() {
  cached().caches = {};
});

gulp.task('clean:tmp:styles', function(cb){ del()([path.join(configs.dirs.tmp, configs.dirs.styles)]).then(function(){cb();}) });
gulp.task('clean:tmp:scripts', function(cb){ del()([path.join(configs.dirs.tmp, configs.dirs.scripts)]).then(function(){cb();}) });
gulp.task('clean:tmp', function(cb){ del()([configs.dirs.tmp]).then(function(){cb();}) });
gulp.task('clean:cache', function(cb){ del()([configs.dirs.cache]).then(function(){cb();}) });

gulp.task('clean:dist', function(cb){ del()([configs.dirs.dist]).then(function(){cb();}) });

gulp.task('clean', function(cb){ del()([configs.dirs.tmp, configs.dirs.dist]).then(function(){cb();}) });

gulp.task('clean:caches', function() {
  cached().caches = {};
});
