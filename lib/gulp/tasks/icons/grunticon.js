var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var del              = lazy_require('del');
var mv               = lazy_require('mv');
var grunticon_lib    = lazy_require('grunticon-lib');
var fs               = lazy_require('fs');
var replace          = lazy_require('gulp-replace');
var gutil            = lazy_require('gulp-util');
var plumber      = lazy_require('gulp-plumber');
var cond         = lazy_require('gulp-cond');

var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var browserSync  = lazy_require('browser-sync');



function grunticonTask(config, cb){
  if(global.watching)
    browserSync().notify("Compiling grunticon " + config.name + " icons, please wait!");

  var iconsDir = path.join(configs.dirs.app, configs.dirs.images, config.base);

  var files = fs().readdirSync(iconsDir).map(function (fileName) {
    return path.join(iconsDir, fileName);
  });

  var Grunticon = grunticon_lib();

  var grunticon = new Grunticon(files, path.join(configs.dirs.app, configs.dirs.styles, config.out), {
    datasvgcss: (config.outputName || config.name) + '.svg.data.scss',
    datapngcss: (config.outputName || config.name) + '.png.data.scss',
    urlpngcss: (config.outputName || config.name) + '.fallback.scss',
    previewhtml: 'preview.html.remove',
    loadersnippet: 'grunticon.loader.js.remove',
    enhanceSVG: false,
    corsEmbed: false,
    pngfolder: 'pngs',
    pngpath: path.join(config.pngs),
    cssprefix: '.icon-',
    tmpPath: path.join(configs.dirs.tmp),
    compressPNG: true,
    optimizationLevel: 3,
    template: 'lib/gulp/tasks/icons/grunticons/template.hbs'
  });

  grunticon.process(function(){
    gutil().log('Postprocessing grunticon files');
    gulp.src([path.join(configs.dirs.app, configs.dirs.styles, config.out, (config.outputName || config.name) + '.fallback.scss')])
      .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Replacing grunticon url error' + config.name)) }))
      .pipe(replace()('url(', 'image-url('))
      .pipe(gulp.dest(path.join(configs.dirs.app, configs.dirs.styles, config.out)))
      .on('end', function(){
        gutil().log('Moving pngs');
        mv()(
          path.join(configs.dirs.app, configs.dirs.styles, config.out, 'pngs'),
          path.join(configs.dirs.app, configs.dirs.images, config.pngs),
          {mkdirp: true}, function(){
            gutil().log('Cleaning unnecesary files');
            del()(path.join(configs.dirs.app, configs.dirs.styles, config.out, '*.remove')).then(function(){cb()});
          })
      });
  });
}

module.exports = grunticonTask;

if (!configs.grunticon) return;

var grunticonTasks = configs.grunticon.icons.map(function (config) {
  var task = 'icons:grunticon:' + config.name;

  gulp.task(task+":clean", function(cb){ del()([path.join(configs.dirs.app, configs.dirs.images, config.pngs)]).then(function(){cb();}) });

  gulp.task(task, [task+":clean"],function (cb) {
    grunticonTask(config, cb)
  });

  return task
});

gulp.task('icons:grunticon', function(cb){
  runSequence(grunticonTasks, cb);
});


// Watch tasks

function watchGrunticonTask(config){
  watch()([
      path.join(configs.dirs.app, configs.dirs.images, config.base, config.regex)
    ],
    { name: 'Watch grunticon icons: ' + config.name },
    batch()(function (events, done) {
      gulp.start('icons:grunticon:' + config.name);
      done();
    }));
}

var watchGrunticonTasks = configs.grunticon.icons.map(function (config) {
  var task = 'watch:icons:grunticon' + config.name;

  gulp.task(task, function () {
    return watchGrunticonTask(config)
  });

  return task
});

gulp.task('watch:icons:grunticon', function(cb){
  runSequence(watchGrunticonTasks, cb);
});
