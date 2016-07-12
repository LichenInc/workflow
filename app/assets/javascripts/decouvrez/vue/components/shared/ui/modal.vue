<script>
  const $ = require('jquery')

  module.exports = {
    name: 'Modal',
    props: {
      show: {
        type: Boolean,
        default() {
          return true
        },
      },
    },
    watch: {
      ['show']() {
        if (!this.show) return
        this.$nextTick(function () {
          $('.wrapper-hype').addClass('-noscroll')
          $(this.$el).focus()
        })
      },
    },
    methods: {
      closeModal() {
        $('.wrapper-hype').removeClass('-noscroll')
        this.show = false
        this.$emit('hide')
      },
    },
  }
</script>

<template>
  <div class="modal-mask" v-show="show" tabindex="1" v-on:keydown.esc="closeModal" v-on:click="closeModal" transition="modal">
    <div class="modal-wrapper">
      <div class="modal-container" v-on:click.stop="">
        <div class="c vuelosebtn" v-on:click="closeModal"></div>
        <div class="modal-body">
          <slot>
            default slot
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  @import "rallye/base/utils/_vendors";

  .modal-mask {
    font-size: 18px;
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;

    .closebtn {
      // @include close-cross(2em, 10%, #fff);
      // @include bounceIn($duration:.4s,$delay:300ms);
      @include position(absolute, -1em -2em null null);
      @extend %btn-opacity;
    }

    .modal-wrapper {
      display: table-cell;
      vertical-align: middle;
    }

    .modal_dialog{
      text-align: center;
    }

    .modal-container {
      width: 70%;
      position: relative;
      font-size: rem(18);
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
    }

    .modal-body {
      margin: 10px 0;
      font-size: 1.4em;
    }
  }

  .modal-enter, .modal-leave {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave .modal-container {
    transform: scale(1.1);
  }
</style>
