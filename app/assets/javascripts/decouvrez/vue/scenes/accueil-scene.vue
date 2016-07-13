<script>

  import Http from 'async/http'
  import Router from 'hype/router'

  module.exports = {
    name: 'AccueilScene',
    props: {
      params: {},
    },
    data() {
      return {
      }
    },
    components: {
    },
    ready() {

    },
  }
</script>

<template lang="jade">

div.accueil-scene.wrapper_scene(v-element-query, min-width="900px 1400px")
  div
    | # Hello JS Montreal


</template>

<style lang="scss" scoped>
  @import "rallye/base/utils/vendors";
  @import "rallye/base/project/mixins";
  @import "rallye/base/project/variables";
  @import "animatewithsass/animate.scss";

  .accueil-scene {
    padding: 200px;
  }
</style>
<style lang="scss">
  @import "rallye/base/utils/vendors";
  @import "rallye/base/project/mixins";
  @import "rallye/base/project/variables";
  @import "animatewithsass/animate.scss";

  .accueil-scene {
    font-family: $font-primary;
    .mot {
      list-style: none;
      height: 200px;
      &:hover {
        background-color: white!important;
      }
      // display: flex;
    }
  }
</style>
