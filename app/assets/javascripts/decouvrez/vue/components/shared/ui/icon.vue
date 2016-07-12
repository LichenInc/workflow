<script>
  const $ = require('jquery')
  import browserDetect from 'hype/browser-detect'

  module.exports = {
    name: 'icon',
    props: {
      icon: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#000',
      },
      size: {
        type: Number,
        coerce(val) {
          return val && val * 1
        },
        default: 1,
      },
      unit: {
        type: String,
        default: 'em',
      },
      rotation: {
        type: String,
        default: '0deg',
      },
      scale: {
        type: String,
        default: '1',
      },
    },
    directives: {
      'embed-svg': require('vue/directives/embed-svg'),
    },
    data() {
      return {
        icon_width: null,
        icon_height: null,
        hasIconsLoaded: false,
      }
    },
    ready() {
      if (this.color === 'inherit') this.color = $(this.$el).css('color')
    },
    computed: {
      ratio() {
        return this.hasIconsLoaded && (this.icon_width / this.icon_height)
      },
      computed_width() {
        return !this.hasIconsLoaded || (this.ratio >= 1)
          ? `${this.size}${this.unit}`
          : `${this.size * this.ratio}${this.unit}`
      },
      computed_height() {
        return !this.hasIconsLoaded || (this.ratio >= 1)
          ? `${this.size * (1 / this.ratio)}${this.unit}`
          : `${this.size}${this.unit}`
      },
      computedStyle() {
        return {
          maxWidth: this.computed_width,
          maxHeight: this.computed_height,
          height: browserDetect.matchIe(11) ? this.computed_height : null,
          fill: this.color,
          transform: `rotate(${this.rotation}) scale(${this.scale})`,
        }
      },
    },
    events: {
      'icons-loaded'() {
        const $svg = $(this.$els.icon).find('svg')
        this.icon_width = $svg.attr('width').replace(/px/, '') * 1
        this.icon_height = $svg.attr('height').replace(/px/, '') * 1
        this.hasIconsLoaded = true
      },
    },
  }
</script>

<template lang="jade">

i.icon-ui(v-el:icon, :class="'icon-'+icon", :style="computedStyle", v-embed-svg, :name="icon")

</template>

<style lang="scss">

  .icon-ui {
    font-size: inherit;
    // line-height: 1em;
    display: inline-block;
    vertical-align: middle;
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    g, path {
      // display: inline!important; // HACK Illustrator
      // stroke: none!important; // HACK Illustrator
      fill: inherit;
    }
  }
</style>
