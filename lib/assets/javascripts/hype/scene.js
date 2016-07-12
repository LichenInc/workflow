import Vue from 'vue'
import $ from 'jquery'

class Scene {
  constructor(name, options = {}) {
    this.name = name
    this.options = options
    this._params = {}
  }

  init(hypeDocument, element, settings) {
    this.hypeDocument = hypeDocument
    this.el = element
    this.settings = settings
    this._setup()
  }

  params(...params) {
    if (this.options.params) {
      for (let i = 0; i < this.options.params.length; i++) {
        Vue.set(this._params, this.options.params[i], params[i])
      }
    } else {
      this._params = params
    }
  }

  destroy() {
    this._unbind()

    this.hypeDocument = undefined
    this.el = undefined
    this._params = {}
  }

  _setup() {
    this._bind()
  }

  _bind() {
    $(`#hype_${this.name}_scene`).empty()
    const child = $('<div class="wrapper-hype"/>').appendTo(`#hype_${this.name}_scene`)
    this.vue = new Vue({
      el: child.get(0), // `#hype_${this.name}_scene`,
      name: `${this.name}_scene`,
      replace: false,
      parent: this.options.parent,
      store: this.options.store,
      data: {
        params: this._params,
        hypeDocument: this.hypeDocument,
      },
      components: {
        scene: this.options.component,
      },
      template: '<scene :params="params" :hype-document.once="hypeDocument" ></scene>',
    })
  }

  _unbind() {
    this.vue.$destroy(true)
  }

  static new(...args) { return new Scene(...args) }
}

export default Scene
