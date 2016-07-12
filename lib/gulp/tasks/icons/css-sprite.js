var gulp        = require('gulp');
var runSequence = require('run-sequence');
var path        = require('path');

var configs      = gulp_require('config');
var handleErrors = gulp_require('util/handleErrors');

var sprite       = lazy_require('sprity');
var gif         = lazy_require('gulp-if');

function spriteTask(name){
  return sprite().src({
      src: path.join(configs.dirs.app, configs.dirs.images, 'icons', name, '*.png'),
      template: 'lib/gulp/tasks/icons/css-sprites/sprity.hbs',
      name: name,
      style: '_sprite-' + name + '.scss',
      cssPath: 'sprites',
      dimension: [{
        ratio: 1, dpi: 72
      }, {
        ratio: 2, dpi: 192
      }],
      orientation: 'binary-tree',
      prefix: name,
      margin: 4,
      'lwip-interpolation': 'lanczos'
    })
    .pipe(gif()('*.png', gulp.dest(path.join(configs.dirs.app, configs.dirs.images, 'sprites')), gulp.dest(path.join(configs.dirs.app, configs.dirs.styles, 'shared', 'sprites'))));
}

module.exports = spriteTask;

if (!configs.sprites) return;

var spritesTasks = configs.sprites.map(function (name) {
  var task = 'images:sprity:' + name;

  gulp.task(task, function () {
    return spriteTask(name)
  });

  return task
});

gulp.task('images:sprity', function(cb){
  runSequence(spritesTasks, cb);
});
