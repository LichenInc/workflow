
import Router from 'hype/router'
import Scene from 'hype/scene'
// import Store from 'data-store'
// import Vue from 'vue'
// const Http = Store.adapters.http

// Scenes
const AccueilScene = Scene.new('accueil', {
  component: require('vue/scenes/accueil-scene.vue'),
})


ModuleLoader.module('DecouvrezPage')
  .register('AccueilScene', AccueilScene)


function Init(hypeDocument) {
  window.HYPE_eventListeners = []
  Router.hype(hypeDocument)

  Router.configure({
    async: true,
    notfound: 'intro',
  })

  const routes = {
    '/': {
      state: 'intro',
      on: [Router.showScene(AccueilScene)],
    },
  }

  Router.mount(routes, '/')
  Router.init('intro')
}

if (window.hypeDocument) {
  Init(window.hypeDocument)
} else {
  window.HYPE_eventListeners = window.HYPE_eventListeners || []
  window.HYPE_eventListeners.push({ type: 'HypeDocumentLoad', callback: Init })
}
