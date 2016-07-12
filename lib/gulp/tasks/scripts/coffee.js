var gulp        = require('gulp');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var coffee       = lazy_require('gulp-coffee');
var ngAnnotate   = lazy_require('gulp-ng-annotate');

var plumber      = lazy_require('gulp-plumber');
var cond         = lazy_require('gulp-cond');
var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var changed      = lazy_require('gulp-changed');
var filter   = lazy_require('gulp-filter');
var browserSync  = lazy_require('browser-sync');

var regex = '**/*.{coffee,litcoffee,coffee.md}';

function coffeeTask(){
  if(global.watching)
    browserSync().notify("Compiling coffescript files, please wait!");

  var destPath = path.join(configs.dirs.tmp, configs.dirs.assets);

  return gulp.src([
    path.join(configs.dirs.app, configs.dirs.scripts, regex),
    path.join(configs.dirs.lib, configs.dirs.scripts, regex)
  ])

    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Coffescript compilation error ')) }))

    .pipe(cond()(global.watching, function(){ return changed()(
      destPath, { extension: '.js' }
    )}))

    //.pipe($.cond(config.watching, function(){ return $.sourcemaps.init()} ))

    .pipe(coffee()({ bare: true }))
    .pipe(ngAnnotate()())

    //.pipe($.cond(config.watching, function(){ return $.sourcemaps.write({includeContent: true})} ))

    .pipe(gulp.dest(destPath))

    .pipe(cond()(global.watching, function(){ return filter()('**/*.js')} ))
    .pipe(cond()(global.watching, function(){ return browserSync().reload({stream:true})} ));
}

module.exports = coffeeTask;

gulp.task('scripts:coffee', function () {
  return coffeeTask()
});

gulp.task('watch:scripts:coffee', [], function () {
  watch()([
      path.join(configs.dirs.app, configs.dirs.scripts, regex),
      path.join(configs.dirs.lib, configs.dirs.scripts, regex)
    ],
    { name: 'Watch coffee scripts'},
    batch()(function (events, done) {
      gulp.start('scripts:coffee');
      done();
    }));
});

