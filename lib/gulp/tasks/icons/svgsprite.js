var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var svgsprite    = lazy_require('gulp-svg-sprite');
var plumber      = lazy_require('gulp-plumber');
var browserSync  = lazy_require('browser-sync');

function svgspriteTash(config){
  if(global.watching)
    browserSync().notify("Compiling svgsprite " + config.name + " icons, please wait!");


  return gulp.src(path.join(configs.dirs.app, configs.dirs.images, config.base, '*.svg'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Hogan templates compilation error ' + config.name)) }))

    // .pipe(cond()(global.watching, function(){ return $.newer(path.join(config.dirs.tmp, config.dirs.styles, name + '.css'))} ))

    //.pipe(svgmin())
    .pipe(svgsprite()(configs.svgsprite.options))

    // Destination
    .pipe(gulp.dest(path.join(configs.dirs.cache, config.out)))
}

if(configs.svgsprite){
  var svgspriteTasks = configs.svgsprite.icons.map(function (config) {
    var task = 'icons:svgsprite:' + config.name;

    gulp.task(task, function () {
      return svgspriteTash(config)
    });

    return task
  });

  gulp.task('icons:svgsprite', function(cb){
    runSequence(svgspriteTasks, cb);
  });
}

module.exports = svgspriteTash;
