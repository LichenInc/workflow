<script>
  import Mot from 'models/mot'

  module.exports = {
    name: 'mot-modal',
    props: {
      mot: {
        required: true,
      },
    },
    data() {
      return {
        definition: null,
      }
    },
    ready() {
      Mot.find(this.mot)
        .then(mot => {
          this.definition = mot.definition_html
        })
    },
  }
</script>

<template lang="jade">

modal.mot-modal(:show="true", @hide="$emit('hide')")
  div
    h3 Mot
    div(v-html="definition", v-if="definition")

</template>

<style lang="scss">


.mot-modal {
  .modal_nav{
    display: flex;
    justify-content: center;
  }
}

</style>
