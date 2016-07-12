let _ = require('lodash')
let director = require('director')
let Qs = require('qs')
let UrlPattern = require('url-pattern')

let router = director.Router()

import { NotFoundRequestError } from 'data-store'

let states = {}
let statesUrls = {}

function _stringify(pattern, params, query) {
  if(_.isArray(params)) params = _.reduce(pattern.names, (sum,val,k) => {
    let param = params[k],
        obj = {}
    obj[val] = param
    return Object.assign(sum, obj)
  }, {})
  return _.compact([pattern.stringify(params), Qs.stringify(query)]).join('?')
}

let Router = {
  configure(options) {
    router.configure(options)

    if(!Router.hypeDocument) {
      Router.hypeDocument = window.hypeDocument
    }
  },

  hype(hypeDocument) {
    Router.hypeDocument = hypeDocument
  },

  mount(routes, base){
    statesUrls = _.mapValues(_.invert(_.mapValues(routes, 'state')), (url) => url)
    states = _.mapValues(_.invert(_.mapValues(routes, 'state')), (url) => new UrlPattern(url))
    router.mount(_.mapValues(routes, (v) => _.omit(v, 'state')), base)
  },

  init(state, params = {}, query = {}){
    if(state){
      let pattern = (states.hasOwnProperty(state)) ? states[state] : new UrlPattern(state)
      router.init(_stringify(pattern, params, query))
    } else {
      router.init()
    }
  },

  setState(state, params = {}, query = {}, force = false){
    return Router.setRoute(state, params, query, force = false)
  },

  setRoute(state, params = {}, query = {}, force = false){
    let pattern = (states.hasOwnProperty(state)) ? states[state] : new UrlPattern(state)

    let current_path = Router.getPath(), current_query = Router.getQueryParams()

    if(_.isEqual(pattern.match(current_path), params) && _.isEqual(query, current_query) && !force)
      return false

    router.setRoute(_stringify(pattern, params, query))
    return true
  },



  getRoute(...args){
    return router.getRoute(...args)
  },

  getUrl(){
    return `/${router.getRoute().join('/')}`
  },

  getPath(){
    return Router.getUrl().split('?')[0]
  },

  getQuery(){
    return Router.getUrl().split('?')[1]
  },

  getQueryParams() {
    return Qs.parse(Router.getQuery())
  },



  notFoundScene(Scene, ...options) {
    return (...args) => {
      let next = args.pop()
      Router.hypeDocument.showSceneNamed((_.isString(Scene) ? Scene : Scene.name), ...options)
      next()
      return null
    }
  },

  showScene(Scene, params, ...options) {
    if (!_.isArray(params)) {
      options.unshift(params)
      params = null
    }

    return (...args) => {
      let next = args.pop()
      if(params) {
        let promises = _.map(params, (param) => (_.isFunction(param) ? param(...args) : param) )

        Promise.all(promises)
          .then(function (params) {
            Scene.params(...params)
            Router.hypeDocument.showSceneNamed(Scene.name, ...options)
            next()
          })
          .catch(function(){
            next(false)
          })
      } else {
        Router.hypeDocument.showSceneNamed((_.isString(Scene) ? Scene : Scene.name), ...options)
        next()
      }
      return null
    }
  },

  onError(errorClass, callback) {
    return function handleOnError(error){
      if (error instanceof errorClass)
        callback(error.request)
      return Promise.reject(error)
    }
  },

  onErrorRedirect(errorClass, state) {
    return function handleOnErrorRedirect(error){
      if (error instanceof errorClass) { Router.setRoute(state) }
      return Promise.reject(error)
    }
  },

  onErrorShowScene(errorClass, scene) {
    return function handleOnErrorShowScene(error) {
      if (error instanceof errorClass) { Router.hypeDocument.showSceneNamed(scene) }
      return Promise.reject(error)
    }
  },

  notFoundRedirect(state, next) {
    return function handleNotFoundRedirect(error) {
      return Router.onErrorRedirect(NotFoundRequestError, state)(next, error)
    }
  },

  notFoundShowScene(scene) {
    return function handleNotFoundShowScene(error) {
      return Router.onErrorShowScene(NotFoundRequestError, scene)(error)
    }
  },

  getAllStates() {
    return _.clone(states)
  },

  checkState(state) {
    return states.hasOwnProperty(state)
  },

  getUrlFromState(state, params = {}, query = {}) {
    return Router.checkState(state) ? _stringify(states[state], params, query) : false
  },



  getStateUrlAnaltytics(state) {
    return Router.checkState(state) ? statesUrls[state] : false
  },

  getCurrentState() {
    let current_path = Router.getPath()
    for (let state of Object.keys(states)) {
      if (states[state].match(current_path)) return state
    }
  },

  getRouteParams() {
    let current_path = Router.getPath(), pattern = states[Router.getCurrentState()]
    return pattern.match(current_path)
  },

  setPageAnalytics(base, pageview = false) {
    return (...args) => {
      let next = args.pop()
      let state = Router.getCurrentState()
      state = Router.getStateUrlAnaltytics(state)
      if(state){
        state = base + state
        ga('set', 'page', state)
        if (pageview)
          ga('send', 'pageview', state)
      }
      next()
      return null
    }
  },
}

module.exports = Router
