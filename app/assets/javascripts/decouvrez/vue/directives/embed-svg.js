
module.exports = {
  params: ['name'],
  bind: function() {
    let loadSvg = () => {
      let svg
      if(this._embedsvg_destroy || global.IconsLoader.method != 'svg' || !(svg = global.IconsLoader.icons[this.params.name]))
        return
      this.el.innerHTML = svg
      this.el.style.backgroundImage = "none"
      this.vm.$emit('icons-loaded')
    }
    global.IconsLoader.svgLoaded ? loadSvg() : global.IconsLoader.onloadSvg(loadSvg)
  },
  unbind: function () {
    this._embedsvg_destroy = true
  }
}
