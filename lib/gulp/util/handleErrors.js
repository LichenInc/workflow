var notify = lazy_require("gulp-notify");
var browserSync  = lazy_require('browser-sync');

function notifyError(msg) {

  return function(){
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify().onError({
      title: msg,
      message: "<%= error %>"
    }).apply(this, args);

    browserSync().notify(msg);

    // Keep gulp from hanging on this task
    this.emit('end');
  }

}

module.exports = {
  plumber2: function(msg) {
    return {
      errorHandler: notifyError(msg)
    }
  },

  plumber: function(msg) {
    return {
      errorHandler: function(){
        var args = Array.prototype.slice.call(arguments);

        // Send error to notification center with gulp-notify
        notify().onError({
          title: msg,
          message: "<%= error %>"
        }).apply(this, args);

        browserSync().notify(msg);

        // Keep gulp from hanging on this task
        this.emit('end');
      }
    }
  },

  notify: notifyError

}

