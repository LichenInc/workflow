//moment config
let moment = require('moment')
moment.locale('fr-ca');

const ModuleLoader = require('module-loader')
window.ModuleLoader = ModuleLoader // make it global for hype
window._ = require('lodash') // make it global for hype

require('./scenes/init')
