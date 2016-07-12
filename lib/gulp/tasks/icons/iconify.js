var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var iconify     =  lazy_require('gulp-iconify');
var plumber      = lazy_require('gulp-plumber');
var browserSync  = lazy_require('browser-sync');

function iconifyTash(config){
  if(global.watching)
    browserSync().notify("Compiling iconify " + config.name + " icons, please wait!");


  iconify()({
    src: path.join(configs.dirs.app, configs.dirs.images, config.base, '*.svg'),
    pngOutput: path.join(configs.dirs.app, configs.dirs.images, config.pngs),
    scssOutput: path.join(configs.dirs.app, configs.dirs.styles, config.out),
    cssOutput: path.join(configs.dirs.tmp, 'iconify')
  })
}

module.exports = iconifyTash;

if(!configs.iconify) return;


var iconifyTasks = configs.iconify.icons.map(function (config) {
  var task = 'icons:iconify:' + config.name;

  gulp.task(task, function () {
    return iconifyTash(config)
  });

  return task
});

gulp.task('icons:iconify', function(cb){
  runSequence(iconifyTasks, cb);
});

