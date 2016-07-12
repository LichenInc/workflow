var config = require(__base + 'config/gulp.json');
var _ = require('lodash')

try {
  config = _.merge(config, require(__base + 'config/gulp.local.json'));
}  catch (e) { }

module.exports = config;
