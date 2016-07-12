import $ from 'jquery'

export default {
  ready() {
    this._navcb = (e) => {
      if (e.keyCode === 37) { // left
        this.$emit('navigation:left')
      } else if (e.keyCode === 39) { // right
        this.$emit('navigation:right')
      }
    }
    $(document).on('keydown', this._navcb)
  },
  destroyed() {
    $(document).off('keydown', this._navcb)
  },
}
