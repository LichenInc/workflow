var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');


var sass         = lazy_require('gulp-sass');

var uglify       = lazy_require('gulp-uglify');
var sourcemaps   = lazy_require('gulp-sourcemaps');
var plumber      = lazy_require('gulp-plumber');
var cond         = lazy_require('gulp-cond');
var filter       = lazy_require('gulp-filter');
var size         = lazy_require('gulp-size');

function uglifyJSTask(config){

  return gulp.src(path.join(configs.dirs.dist, configs.dirs.assets, '/**/*.js'))
    .pipe(cond()(global.watching, function(){ return plumber()(handleErrors.plumber('Minify scripts error')) }))

    .pipe(size()({showFiles: true, title: 'scripts'}))

    .pipe(cond()(config.sourcemaps, function(){ return sourcemaps().init({loadMaps: true, debug: true}) } ))

    .pipe(uglify()({preserveComments: 'some'}))

    .pipe(cond()(config.sourcemaps, function(){ return sourcemaps().write('.', { addComment: false, includeContent: false }) } ))

    .pipe(gulp.dest(path.join(configs.dirs.dist, configs.dirs.assets)))

    .pipe(filter()('**/*.js'))
    .pipe(size()({showFiles: true, title: 'scripts minified'}))
}

gulp.task('scripts:uglifyJS', function(){
  return uglifyJSTask(configs.uglifyJS);
});

module.exports = uglifyJSTask;
