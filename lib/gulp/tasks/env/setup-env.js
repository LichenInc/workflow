var gulp = require('gulp');

gulp.task('setup-env:dev', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('setup-env:prod', function() {
  return process.env.NODE_ENV = 'production';
});
