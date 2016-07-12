var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');


var sass         = lazy_require('gulp-sass');

var csso         = lazy_require('gulp-csso');
// var minifyCSS    = lazy_require('gulp-minify-css');
var sourcemaps   = lazy_require('gulp-sourcemaps');
var plumber      = lazy_require('gulp-plumber');
var cond         = lazy_require('gulp-cond');
var filter       = lazy_require('gulp-filter');
var size         = lazy_require('gulp-size');

function minifyCSSTask(config){

  return gulp.src(path.join(configs.dirs.dist, configs.dirs.assets, '/**/*.css'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Minify styles error')) }))

    .pipe(size()({showFiles: true, title: 'styles'}))

    .pipe(cond()(config.sourcemaps, function(){ return sourcemaps().init({loadMaps: true, debug: true}) } ))

    .pipe(csso()())
    //.pipe(cond()(global.distribution, function(){ minifyCSS()({keepBreaks:true}) } ))

    .pipe(cond()(config.sourcemaps, function(){ return sourcemaps().write('.', { addComment: false, includeContent: false }) } ))

    .pipe(gulp.dest(path.join(configs.dirs.dist, configs.dirs.assets)))

    .pipe(filter()('**/*.css'))
    .pipe(size()({showFiles: true, title: 'styles minified'}))
}

gulp.task('styles:minifyCSS', function(){
  return minifyCSSTask(configs.minifyCSS);
});

module.exports = minifyCSSTask;
