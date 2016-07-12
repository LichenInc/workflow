var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs    = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var changed    = lazy_require('gulp-changed');
var imagemin   = lazy_require('gulp-imagemin');
var plumber    = lazy_require('gulp-plumber');
var cond       = lazy_require('gulp-cond');
var size       = lazy_require('gulp-size');
var browserSync  = lazy_require('browser-sync');

// Default options
// {
//   optimizationLevel: 3,    //png
//   progressive: false,      //jpg
//   interlaced: false,       //gif
//   svgoPlugins: [],         //svg
//   use: null                // aditional pluggins
// };

var imagemin_options = {
  progressive: true,
  svgoPlugins: [{removeViewBox: false}]
  // use: [pngcrush()]
};

function imageminTask(config){
  var dest = config.dest || config.src

  return gulp.src(path.join(config.src, config.regex || '**/*.{gif,jpeg,jpg,png,svg}'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Imagemin error ' + config.name)) }))

    .pipe(cond()(global.watching, function(){ return changed()(dest) })) // Ignore unchanged files
    .pipe(imagemin()(imagemin_options)) // Optimize
    .pipe(gulp.dest(global.distribution ? path.join(configs.dirs.dist, configs.dirs.assets) : path.join(dest)))

    .pipe(cond()(global.distribution, function(){ return size()({title: 'images: ' + config.name}) } ))

    .pipe(cond()(global.watching, function(){ return browserSync().reload({stream:true}) }));
}

module.exports = imageminTask;

if(!configs.images) return;

var imageminTasks = configs.images.map(function (config) {
  var task = 'imagemin:' + config.name

  gulp.task(task, function () {
    return imageminTask(config)
  });

  return task
});

gulp.task('imagemin', function(cb){
  runSequence(imageminTasks, cb);
});

