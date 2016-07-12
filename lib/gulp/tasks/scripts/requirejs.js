var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');

var requirejsOptimize  = lazy_require('gulp-requirejs-optimize');

function requirejsTask(config){
  return gulp.task('scripts:requirejs', function () {

    return gulp.src(path.join(configs.dirs.tmp, configs.dirs.assets, config.configFile))
      .pipe(requirejsOptimize()({
        baseUrl: path.join(configs.dirs.tmp, configs.dirs.assets),
        out: config.out,
        mainConfigFile: path.join(configs.dirs.tmp, configs.dirs.assets, config.configFile),
        name: config.name,
        optimize: 'none',
        wrapShim: config.wrapShim || false,
        paths: configs.requirejs.paths || {}
      }))
      .pipe(gulp.dest(path.join(configs.dirs.dist, configs.dirs.assets)));
  });
}

module.exports = requirejsTask;

if(!configs.requirejs) return;

var requirejsTasks = configs.requirejs.bundleConfigs.map(function (config) {
  var task = 'scripts:requirejs:' + config.name;

  gulp.task(task, function () {
    return requirejsTask(config)
  });

  return task
});

gulp.task('scripts:requirejs', function(cb){
  runSequence(requirejsTasks, cb);
});



