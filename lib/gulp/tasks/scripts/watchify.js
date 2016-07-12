var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs        = gulp_require('config');
var browserifyMode = gulp_require('tasks/scripts/browserify');

var watchifyTask = browserifyMode(true);

if(!configs.browserify) return;

var watchifyTasks = configs.browserify.bundleConfigs.map(function (config) {
  var task = 'watchify:' + config.name;

  gulp.task(task, function () {
    return watchifyTask(config)
  });

  return task
});

gulp.task('watchify', function(cb){
  runSequence(watchifyTasks, cb);
});
