<script>

  import compile from './phrase-compiler'

  module.exports = {
    name: 'phrase-compiler',
    props: {
      phrase: {
        required: true,
      },
    },
    computed: {
      splits() {
        return compile(this.phrase)
      },
    },
  }
</script>

<template lang="jade">

div.phrase-compiler
  span.split(v-for="mot in splits")
    span(v-if="!mot.is_dico") {{mot.text}}
    b(v-else)
      button.button(type="button", v-on:click="$emit('mot', mot.api_mot || mot)") {{mot.text}}

</template>

<style lang="scss" scoped>
  @import "rallye/base/utils/vendors";
  @import "rallye/base/project/mixins";
  @import "rallye/base/project/variables";
  @import "animatewithsass/animate.scss";

  .phrase-compiler {
    .button {
      font: inherit;
      background: none;
      padding: 0;
      margin: 0;
    }
  }
</style>
