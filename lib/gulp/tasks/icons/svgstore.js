var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var svgstore     =  lazy_require('gulp-svgstore');
var plumber      = lazy_require('gulp-plumber');
var browserSync  = lazy_require('browser-sync');

function svgstoreTash(config){
  if(global.watching)
    browserSync().notify("Compiling svgstore " + config.name + " icons, please wait!");


  return gulp.src(path.join(configs.dirs.app, configs.dirs.images, config.base, '*.svg'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Hogan templates compilation error ' + config.name)) }))

    // .pipe(cond()(global.watching, function(){ return $.newer(path.join(config.dirs.tmp, config.dirs.styles, name + '.css'))} ))

    //.pipe(svgmin())
    .pipe(svgstore()(configs.svgstore.options))

    // Destination
    .pipe(gulp.dest(path.join(configs.dirs.cache, config.out)))
}

if(configs.svgstore) {
  var svgstoreTasks = configs.svgstore.icons.map(function (config) {
    var task = 'icons:svgstore:' + config.name;

    gulp.task(task, function () {
      return svgstoreTash(config)
    });

    return task
  });

  gulp.task('icons:svgstore', function (cb) {
    runSequence(svgstoreTasks, cb);
  });
}

module.exports = svgstoreTash;
