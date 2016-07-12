var gulp        = require('gulp');
var path        = require('path');
var _           = require('lodash');

var configs    = gulp_require('config');

var browserSync  = lazy_require('browser-sync');
var proxy        = lazy_require('proxy-middleware');
var url          = lazy_require('url');
var apimock      = lazy_require('apimock-middleware');

var gutil        = lazy_require('gulp-util');

gulp.task('bs-reload', function () {
  browserSync().reload();
});

function browserSyncTask(config){

  var server_options = {
    scriptPath: function (path, port, options) {
      return options.get("absolute");
    },
    minify: true
  };

  var options = _.merge(server_options, config);

  if (options.proxy) {
    var middlewares = [];

    if (gutil().env.mock) {
      middlewares.push(apimock()(global.__base + 'test/mocks/' + 'server' + '.yaml'))
    }

    options.proxy = {
      target: config.proxy,
      middleware: middlewares
    };

    if(options.serveStatic === true){
      options.serveStatic = [
        path.join(configs.dirs.public),
        path.join(configs.dirs.tmp)]
    }

  } else {
    options.server = {
      baseDir: [
        path.join(configs.dirs.app, configs.dirs.views),
        path.join(configs.dirs.tmp, configs.dirs.assets),
        path.join(configs.dirs.app, configs.dirs.assets),
        path.join(configs.dirs.vendor)
      ],
      //routes: {
      //  "/bower_components": "vendor/bower_components",
      //  "/source": './'
      //},
      middleware: middlewares
    }
  }

  return browserSync()(options);
}

gulp.task('browser-sync', function() {
  browserSyncTask(configs.browsersync)
});


module.exports = browserSyncTask;
