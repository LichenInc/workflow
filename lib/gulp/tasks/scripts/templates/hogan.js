var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var hogan        = lazy_require('gulp-hogan-compile');
var plumber      = lazy_require('gulp-plumber');

var cond         = lazy_require('gulp-cond');
var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var browserSync  = lazy_require('browser-sync');

function hoganTask(config){
  if(global.watching)
    browserSync().notify("Compiling hogan " + config.name + " templates, please wait!");


  return gulp.src(path.join(configs.dirs.app, configs.dirs.templates, config.base, config.regex || '**/*.mustache'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Hogan templates compilation error ' + config.name)) }))

    // .pipe(cond()(global.watching, function(){ return $.newer(path.join(config.dirs.tmp, config.dirs.styles, name + '.css'))} ))

    .pipe(hogan()(config.out, configs.hogan.options))

    // Destination
    .pipe(gulp.dest(path.join(config.cache || configs.dirs.cache)))
}

module.exports = hoganTask;

if(!configs.hogan) return;

var hoganTasks = configs.hogan.templates.map(function (config) {
  var task = 'templates:hogan:' + config.name;

  gulp.task(task, function () {
    return hoganTask(config)
  });

  return task
});

gulp.task('templates:hogan', function(cb){
  runSequence(hoganTasks, cb);
});

// Watch tasks

function watchHoganTask(config){
  watch()([
      path.join(configs.dirs.app, configs.dirs.templates, config.base, config.regex || '**/*.mustache')
    ],
    { name: 'Watch hogan templates: ' + config.name },
    batch()(function (events, done) {
      gulp.start('templates:hogan:' + config.name);
      done();
    }));
}

var watchHoganTasks = configs.hogan.templates.map(function (config) {
  var task = 'watch:templates:hogan:' + config.name

  gulp.task(task, function () {
    return watchHoganTask(config)
  });

  return task
});

gulp.task('watch:templates:hogan', function(cb){
  runSequence(watchHoganTasks, cb);
});
