'use strict';

global.__base = __dirname + '/';
global.gulp_require = function(name) { return require(__dirname + '/lib/gulp/' + name); }
global.lazy_require = require('lazy-req')(require);

// Require all tasks in gulp/tasks, including subfolders
require('require-dir')('./lib/gulp/tasks', { recurse: true });

var gulp = require('gulp');
var runSequence = require('run-sequence');
var configs      = gulp_require('config');

// require_task('images/css-sprite');

gulp.task('compile',[], function(cb){
  runSequence(
    [(global.watching ? 'watchify' : 'browserify'), 'styles:sass', 'copy:fonts'],
    cb);
});

gulp.task('watch', function(cb){
  runSequence([
      'watch:icons:grunticon',
      'watch:styles:sass'],
    cb);
});

gulp.task('serve',['clean', 'setup-env:dev'], function(cb){
  global.watching = true;
  runSequence(['compile'],
    ['watch', 'browser-sync'],
    cb);
});

gulp.task('dist:compile',[], function(cb){
  global.distribution = true;
  runSequence(
    ['browserify', 'styles:sass'],
    cb);
});

gulp.task('dist',['clean', 'setup-env:prod'], function(cb){
  global.distribution = true;
  runSequence(
    ['dist:compile'],
    // ['dist:rev'],
    // ['dist:gzip'],
    cb);
});

gulp.task('default', ['serve']);
