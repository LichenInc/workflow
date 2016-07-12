module.exports = function (gulp, $, config, lazyReq) {
  var browserSync = lazyReq('browser-sync');
  var path = require('path');

  var rubysass = function (name, expr, dest) {
    browserSync().notify("Compiling " + expr + " styles, please wait!");
    return gulp.src(path.join(config.dirs.app, config.dirs.styles, expr))
      .pipe($.plumber({
        errorHandler: $.notify.onError("Sass compilation error: <%= error.message %>")
      }))
      .pipe($.rubySass({
        bundleExec: config.sass.bundle,
        require: config.sass.require,
        container: name,
        loadPath: config.sass.loadpaths,
        style: config.sass.style,
        debugInfo: false,
        lineNumbers: true,
        cacheLocation: path.join(config.dirs.tmp, '/.sass-cache'),
        precision: config.sass.precision
      }))
      .pipe($.autoprefixer(config.autoprefixer.default))
      .pipe(gulp.dest(path.join(config.dirs.build)));
    //.pipe($.filter('**/*.css'))
    //.pipe(browserSync().reload({stream:true}));
  }

  gulp.task('styles:rubysass:default', function () {
    return rubysass('default', config.sass.default, '')
  });

  var all = [];

  config.sass.styles.forEach(function (style) {
    var task = 'styles:rubysass:' + style.name;
    all.push(task);
    gulp.task(task, function () {
      return rubysass(style.name, style.file, style.dst)
    });
  });

  gulp.task('styles:rubysass', all);

  return rubysass
};

