/**
 * VUE SETUP
 */

import Vue from 'vue'

/***********
 * PLUGINS *
 ***********/
import VueElementQuery from 'vue-element-query'
Vue.use(VueElementQuery)
import VueTransferDom from 'vue-transfer-dom'
Vue.use(VueTransferDom)
import VueAsyncData from 'vue-async-data'
Vue.use(VueAsyncData)


/**************
 * COMPONENTS *
 **************/
Vue.component('icon', require('vue/components/shared/ui/icon.vue'))
Vue.component('modal', require('vue/components/shared/ui/modal.vue'))
// Vue.component('swapper', require('components/shared/ui/swapper.vue'))


/**************
 * DIRECTIVES *
 **************/
Vue.directive('embed-svg', require('vue/directives/embed-svg.js'))

/***********
 * FILTERS *
 ***********/
Vue.filter('routeurl', require('vue/filters/routeurl.js'))
Vue.filter('day', require('vue/filters/day.js'))


/***********
 * TRANSITIONS *
 ***********/
Vue.transition('slideInBackward', {
  type: 'animation',
  enterClass: 'slideInLeft',
  leaveClass: 'slideOutRight',
})

Vue.transition('slideInForward', {
  type: 'animation',
  enterClass: 'slideInRight',
  leaveClass: 'slideOutLeft',
})

if (process.env.NODE_ENV !== 'production') {
  Vue.config.debug = true
}
