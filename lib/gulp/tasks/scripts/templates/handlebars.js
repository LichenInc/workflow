var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var handlebarsRuntime   = lazy_require('handlebars');
var handlebars   = lazy_require('gulp-handlebars');
var wrap         = lazy_require('gulp-wrap');
var declare      = lazy_require('gulp-declare');
var defineModule = lazy_require('gulp-define-module');
var concat       = lazy_require('gulp-concat');

var cond         = lazy_require('gulp-cond');
var plumber      = lazy_require('gulp-plumber');
var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var changed      = lazy_require('gulp-changed');
var cached       = lazy_require('gulp-cached');
var remember     = lazy_require('gulp-remember');
var browserSync  = lazy_require('browser-sync');

function handlebarsTask(config){
  if(global.watching)
    browserSync().notify("Compiling handlebars " + config.name + " templates, please wait!");


  var basePath = path.join(configs.dirs.app, configs.dirs.templates, config.base);

  var destPath = path.join(config.cache || configs.dirs.cache, config.dest);

  return gulp.src(path.join(basePath, config.regex || '**/*.hbs'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Handlebars compilation error ' + config.name)) }))

    .pipe(cond()(configs.handlebars.commonjs && global.watching, function(){ return changed()(
      destPath, { extension: '.js' }
    )}))
    .pipe(cond()(configs.handlebars.amd && global.watching, function(){ return cached()(
      'templates:handlebars:' + config.name, { optimizeMemory: false }
    )}))

    .pipe(handlebars()({
      handlebars: handlebarsRuntime()
    }))

    .pipe(cond()(configs.handlebars.amd, function(){ return wrap()('Handlebars.template(<%= contents %>)') } ))
    .pipe(cond()(configs.handlebars.amd, function(){ return declare()({
      namespace: 'Handlebars',
      noRedeclare: true, // Avoid duplicate declarations
      processName: function(filePath) {
        // Allow nesting based on path using gulp-declare's processNameByPath()
        // You can remove this option completely if you aren't using nested folders
        // Drop the client/templates/ folder from the namespace path by removing it from the filePath
        return declare().processNameByPath(filePath.replace(basePath, ''));
      }
    }) } ))
    //.pipe($.cond(config.watching, function(){ return $.remember('handlebars')} ))
    .pipe(cond()(configs.handlebars.amd && global.watching, function(){ return remember()('templates:handlebars:' + config.name) }))
    .pipe(cond()(configs.handlebars.amd, function(){ return concat()(config.out) } ))
    .pipe(cond()(configs.handlebars.amd, function(){ return defineModule()('plain', { wrapper: "define(['handlebars'], function(Handlebars) { <%= contents %> return this['Handlebars']; })" }) } ))

    .pipe(cond()(configs.handlebars.commonjs, function(){ return defineModule()('node') } ))

    // Destination
    .pipe(gulp.dest(destPath));

   // .pipe($.cond(config.watching, function(){ return browserSync().reload({stream:true})} ));
}

module.exports = handlebarsTask;

if(!configs.handlebars) return;

var handlebarsTasks = configs.handlebars.templates.map(function (config) {
  var task = 'templates:handlebars:' + config.name;

  gulp.task(task, function () {
    return handlebarsTask(config)
  });

  return task
});

gulp.task('templates:handlebars', function(cb){
  runSequence(handlebarsTasks, cb);
});

// Watch tasks

function watchHandlebarsTask(config){
  function cleanDeleted(file) {
    if( file.event === 'deleted' || file.event ==='unlink'){
      delete cached().caches['templates:handlebars:' + config.name][file.path];
      remember().forget('templates:handlebars:' + config.name, file.path.replace(/.hbs$/,'.js')); // don't work .hbs different from remembered .js
    }
  }

  watch()([
      path.join(configs.dirs.app, configs.dirs.templates, config.base, config.regex || '**/*.hbs')
    ],
    { name: 'Watch handlebars templates: ' + config.name },
    batch()(function (events, done) {
      if (configs.handlebars.amd) cleanDeleted(file);
      gulp.start('templates:handlebars:' + config.name);
      done();
    }));
}

var watchHandlebarsTasks = configs.handlebars.templates.map(function (config) {
  var task = 'watch:templates:handlebars:' + config.name;

  gulp.task(task, function () {
    return watchHandlebarsTask(config)
  });

  return task
});

gulp.task('watch:templates:handlebars', function(cb){
  runSequence(watchHandlebarsTasks, cb);
});

