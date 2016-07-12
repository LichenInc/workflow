<script>
exports default {
  name: 'compile_html',
  props: {
    html: {
      required: true,
      type: String,
      twoWay: false,
    }
  },
  created() {
    this.$options.template = this.$options.template.split('@@@').join(this.html || '')
  },
  components: {
    wrapperHtml: {
      name: 'wrapper_html',
    }
  }
};
</script>

<template lang="jade">
div
  wrapper-html(inline-template='')
    | @@@
</template>
