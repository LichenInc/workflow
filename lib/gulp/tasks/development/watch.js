var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var browserSync  = lazy_require('browser-sync');

gulp.task('watch:static:html', function(){
  gulp.watch([
    path.join(configs.dirs.app, configs.dirs.views, '**/*.{html,html.erb}'),
  ], function(){
    browserSync().reload();
  });
});

gulp.task('watch:static:js', function(){
  gulp.watch([
    path.join(config.dirs.app, config.dirs.scripts, '**/*.js'),
  ], function(){
    browserSync().reload();
  });
});

gulp.task('watch:static:css', function(){
  watch()([
      path.join(configs.dirs.app, configs.dirs.styles, '**/*.css')
    ],
    { name: 'Watch static css'},
    function(files, cb) {
      files.pipe(browserSync().reload({stream:true}));
      cb();
    });
});
