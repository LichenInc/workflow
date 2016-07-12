var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');
var _           = require('lodash');
var argv        = require('yargs').argv;

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var browserify   = lazy_require('browserify');
var watchify     = lazy_require('watchify');
var browserifyShim  = lazy_require('browserify-shim');
var babelify     = lazy_require('babelify');
var vueify       = lazy_require('vueify');
var stripify     = lazy_require('stripify');
var browserifyHmr = lazy_require('browserify-hmr');
var deamdify     = lazy_require('deamdify');
var envify       = lazy_require('loose-envify/custom');
var minifyify    = lazy_require('minifyify');
var collapse     = lazy_require('bundle-collapser/plugin');
var source       = lazy_require('vinyl-source-stream');
var buffer       = lazy_require('vinyl-buffer');

var gutil        = lazy_require('gulp-util');
var filter       = lazy_require('gulp-filter');
var cond         = lazy_require('gulp-cond');
var size         = lazy_require('gulp-size');
var sourcemaps   = lazy_require('gulp-sourcemaps');
var browserSync  = lazy_require('browser-sync');


function browserifyMode(watchMode) {

  function browserifyThis(options) {

    var production = process.env.NODE_ENV === 'production';

    var name = options.name;
    var config = options.options;

    if (global.watching)
      browserSync().notify("Compiling browserify" + name + ", please wait!");

    var bundleConfig = {
      extensions: [".js", ".es6"],
      paths: [
        './' + path.join(configs.dirs.app, configs.dirs.scripts),
        './' + path.join(configs.dirs.lib, configs.dirs.scripts),
        './' + path.join(configs.dirs.cache),
        './' + path.join(configs.dirs.bower_components)
      ]
    };

    if(options.base){
      bundleConfig.paths.push('./' + path.join(configs.dirs.app, configs.dirs.scripts, options.base));
    }

    if (watchMode) {
      // Add watchify args and debug (sourcemaps) option
      bundleConfig = _.merge(bundleConfig, watchify().args, config, {debug: configs.browserify.sourcemaps});
      // A watchify require/external bug that prevents proper recompiling,
      // so (for now) we'll ignore these options during development. Running
      // `gulp browserify` directly will properly require and externalize.
      bundleConfig = _.omit(bundleConfig, ['external', 'require']);
    } else {
      bundleConfig = _.merge(bundleConfig, config);
    }

    var b = browserify()(bundleConfig);

    b = b.transform(browserifyShim(), { global: true });

    if (options.deamdify) {
      b = b.transform(deamdify(), { global: true });
    }

    b = b.transform(babelify().configure({
      presets: ["es2015"],
      plugins: [
        ["transform-es2015-classes", {loose: true}],
         "transform-object-assign",
         "transform-proto-to-assign",
         "transform-undefined-to-void"
      ],
      ignore: ["bower_components", new RegExp('/node_modules/(?!(' + (configs.browserify.babelify || []).join('|') + ')/)')]
    }), { global: true });

    if (options.vueify) {
      vueify().compiler.applyConfig({
        // configure a built-in compiler
        sass: {
          includePaths: configs.sass.options.includePaths
        },
        // configure autoprefixer
        autoprefixer: configs.autoprefixer[options.autoprefixer || 'default']
      });

      b = b.transform(vueify())
    }

    var yaml = require('js-yaml');
    var fs   = require('fs');
    var doc = yaml.safeLoad(fs.readFileSync('config/global/frontend.yml', 'utf8'))
    doc = doc[process.env.NODE_ENV || 'development']

    b = b.transform(envify()(_.merge(process.env, { _: 'purge' }, doc)))

    if (production) {
      b = b.transform(stripify(), { global: true })
      b = b.plugin(collapse())
    }

    if(production && argv.min) {
      b = b.plugin(minifyify(), {map: false});
    }

    var bundle = function bundle() {

      var a = b.bundle();

      if(global.watching){
        a = a.on('error', handleErrors.notify('Browserify compilation error'))
      }

      return a

        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specify the
        // desired output filename here.
        .pipe(source()(bundleConfig.outputName))

        // Use vinyl-buffer to allow pipe new
        // streams
        .pipe(buffer()())

        // loads map from browserify file
        //.pipe(cond()(configs.browserify.sourcemaps, function(){ return sourcemaps().init({loadMaps: true}) } ))
        // Add transformation tasks to the pipeline here.
        //.pipe(ngAnnotate()())
        //.pipe(cond()(configs.browserify.sourcemaps, function(){ return sourcemaps().write({includeContent: true}) } ))

        .pipe(gulp.dest(global.distribution ? path.join(configs.dirs.dist) : path.join(configs.dirs.tmp, configs.dirs.assets)))

        .pipe(cond()(global.distribution, function () { return size()({title: 'scripts:' + name}) }))
        .pipe(cond()(global.watching && !options.vueify, function () { return filter()('**/*.js') }))
        .pipe(cond()(global.watching && !options.vueify, function () { return browserSync().reload({stream: true}) }));
    };

    // Sort out shared dependencies.
    // b.require exposes modules externally
    if (config.require) b.require(config.require);
    // b.external excludes modules from the bundle, and expects
    // they'll be available externally
    if (config.external) b.external(config.external);

    if (watchMode) {
      if (options.vueify) {
        var port = 9200 + options.index;

        b = b.plugin(browserifyHmr(), {
          url: "http://localhost:" + port,
          port: port
        });
      }

      // Wrap with watchify and rebundle on changes
      b = watchify()(b);

      // Rebundle on update
      b.on('update', function(){
        browserSync().notify("Compiling browserify" + name + ", please wait!");
        return bundle();
      });

      b.on('time', function(time){
        browserSync().notify("Compiled browserify" + name + " in " + time + "ms");
      });
    }

    // output build logs to terminal
    b.on('log', gutil().log);

    return bundle();
  }

  return browserifyThis;
};

module.exports = browserifyMode;

if(!configs.browserify) return;

var browserifyTask = browserifyMode(false);

var index = 0;

var browserifyTasks = configs.browserify.bundleConfigs.map(function (config) {
  var task = 'browserify:' + config.name;

  config.index = index;
  index += 1;

  gulp.task(task, function () {
    return browserifyTask(config)
  });

  return task
});

gulp.task('browserify', function(cb){
  runSequence(browserifyTasks, cb);
});
