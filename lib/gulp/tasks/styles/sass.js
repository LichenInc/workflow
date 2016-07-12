var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');
var _           = require('lodash');

var argv        = require('yargs').argv;

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');


var sass         = lazy_require('gulp-sass');
var assetFunctions = lazy_require('node-sass-asset-functions');
var postcss      = lazy_require('gulp-postcss');
var postcssSorting = lazy_require('postcss-sorting');
var autoprefixer = lazy_require('autoprefixer');
var cssnano      = lazy_require('cssnano');
var sourcemaps   = lazy_require('gulp-sourcemaps');
var plumber      = lazy_require('gulp-plumber');
var cond         = lazy_require('gulp-cond');
var size         = lazy_require('gulp-size');
var filter       = lazy_require('gulp-filter');

var watch        = lazy_require('gulp-watch');
var batch        = lazy_require('gulp-batch');
var browserSync  = lazy_require('browser-sync');

function libsassTask(config){
  var production = process.env.NODE_ENV === 'production';

  if(global.watching)
    browserSync().notify("Compiling " + config.name + " styles, please wait!");

  var postCssPlugins = [
    postcssSorting()({ "sort-order": "csscomb" }),
    autoprefixer()(configs.autoprefixer[config.autoprefixer || 'default'] || { browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1"] })
  ]

  if(production && argv.min) {
    postCssPlugins.push(
      cssnano()({autoprefixer: false, safe: true})
    )
  }

  var defaults_options = { functions: assetFunctions()({
    http_images_path: '/assets',
    http_fonts_path: '/assets'
  })}

  return gulp.src(path.join(configs.dirs.app, configs.dirs.styles, config.main))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('LibSass compilation error ' + config.name)) }))

    // .pipe(cond()(global.watching, function(){ return $.newer(path.join(config.dirs.tmp, config.dirs.styles, name + '.css'))} ))

    .pipe(cond()(!global.distribution && config.sourcemaps, function(){ return sourcemaps().init({debug: true}) } ))

    .pipe(sass()(_.merge(defaults_options, configs.sass.options)))
    .pipe(postcss()(postCssPlugins))

    .pipe(cond()(!global.distribution && config.sourcemaps, function(){ return sourcemaps().write('.', {includeContent: true, sourceMappingURLPrefix: '/assets/'}) } ))

    // Destination
    .pipe(gulp.dest(global.distribution ? path.join(configs.dirs.dist, config.out || '') : path.join(configs.dirs.tmp, configs.dirs.assets, config.out || '')))
    .pipe(cond()(global.distribution, function(){ return size()({title: 'styles: ' + config.name}) } ))

    // Reload broser-sync
    .pipe(cond()(global.watching, function(){ return filter()('**/*.css')} ))
    .pipe(cond()(global.watching, function(){ return browserSync().reload({stream:true}) }));
}

module.exports = libsassTask;

if(!configs.sass) return;

var sassTasks = configs.sass.styles.map(function (config) {
  var task = 'styles:sass:' + config.name;

  gulp.task(task, function () {
    return libsassTask(config)
  });

  return task
});

gulp.task('styles:sass', function(cb){
  runSequence(sassTasks, cb);
});

// Watch tasks

function watchSassTask(config){
  var sources = config.sources ? [
    path.join(configs.dirs.app, configs.dirs.styles, config.sources)
  ] : []
  sources.push(path.join(configs.dirs.app, configs.dirs.styles, config.main))

  watch()(sources,
    { name: 'Watch sass sources: ' + config.name },
    batch()(function (events, done) {
      gulp.start('styles:sass:' + config.name, done);
    }));
}

var watchStylesTasks = configs.sass.styles.map(function (config) {
  var task = 'watch:styles:sass:' + config.name;

  gulp.task(task, function () {
    return watchSassTask(config)
  });

  return task
});

gulp.task('watch:styles:sass', function(cb){
  runSequence(watchStylesTasks, cb);
});

module.exports = libsassTask;
