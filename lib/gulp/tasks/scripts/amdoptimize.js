module.exports = function(gulp, $, config, lazyReq) {

  var path = require('path');
  var amdOptimize = require("amd-optimize");

  gulp.task('scripts:requirejs', function () {
    return gulp.src(path.join(config.dirs.tmp, config.dirs.scripts, '**/*.js'))
      .pipe(amdOptimize(config.requirejs.moduleName, {
        baseUrl: path.join(config.dirs.tmp, config.dirs.scripts),
        configFile: path.join(config.dirs.tmp, config.dirs.scripts, config.requirejs.name + '.js'),
        wrapShim: config.requirejs.wrapShim || false,
        paths: config.requirejs.paths || {}
      }))
      .pipe($.concat(config.requirejs.out))
      .pipe(gulp.dest(path.join(config.dirs.dist, config.dirs.scripts)));
  });
};

