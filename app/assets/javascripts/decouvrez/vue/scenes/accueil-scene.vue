<script>

  import Http from 'async/http'
  import Router from 'hype/router'
  // import markdown from 'vue/directives/markdown'

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
    // directives: {
    //    markdown,
    // },
    ready() {
      // marked.setOptions({
      //   renderer: new marked.Renderer(),
      //   gfm: true,
      //   tables: true,
      //   breaks: false,
      //   pedantic: false,
      //   sanitize: true,
      //   smartLists: true,
      //   smartypants: false,
      // })
    },
  }
</script>

<template lang="jade">

div.accueil-scene.wrapper_scene(v-element-query, min-width="900px 1400px")
  div(v-markdown).
    # alllosdkfjslkj
//- INTRODUCTION
//- - A quick word about me/Lichen
//- - 15 year of running business
//- - Advertising company: we work for several clients with different activities:
//-   . education
//-   . ecommerce
//-   . scenography
//- - We are playing with/hacking web technologies to serve communication purposes. We build unique products like :
//-   . all kinds of webapps: ebooks, digital education platform, games
//-   . textos bots
//-   . Dokoma box
//-
//- => We’re dealing with the web production daily.
//-
//- - WARNING: What we’re about to present is not Kosher (not conventional),  but since we worked this way its a revolution for us, now we can’t return to the old way. We use it everyday now to built ourselves and I hope it will inspire some of you. Cause, in my humble opinion, we definitely need to diversify the web. I’m sure some purist in the room will have a lot a questions about it.
//- - When you speak about webapps production its a bit blurry cause there is no standard. Industry is moving fast (you know it better than me), front-end technologies are growing fast but quickly deprecated.
//- . For the rest of the speech, lets assume that we’re talking about webapps that structured so that backend is separated from front-end and communicate with an API
//- - For years we’ve been outsourcing our frontend because we couldn’t afford to produce it internally. Why? cause we wanted to build custom design & avoid precooked solutions like Bootstrap (websites are all looking the same today), and you need ressources. And we’ve always felt that is was kind of wrong.
//- . as a small company, we work in a very flexible way.
//- . problem of recruiting front-end developers
//- . Here’s what our production looked like ( maquette indesign > bulgares > 2 weeks later we received the layouts > integration with rails > corrections > etc ….)
//- . problem of mockups designed with print-oriented software (designers)
//- . designers and developers are not working hand to hand.
//- . as a small team we need to find best solution to accelerate learning curve to welcome new team members.
//-
//- LA DÉMARCHE
//- - So one year ago, we had a project called Robert veut lire. We started working with a software called Hype. And it ended up like that (on montre le site internet)
//-
//- - Hype is amazing : it is used by Lapresse to handle advertising in Lapresse+.
//- . it generate HTML built with a designer-friendly interface. You can create shapes, texts, widgets. Scenes system with transitions. Symbols, etc. Interactions handled with intern events.
//- . you can assign javascript function to be called on specifics hooks.
//- - Is we can build pretty complex why not try to build a whole website with it ?
//- . for designers the benefit is huge. We you build a prototype : you want to move the logo ? Go ahead move it it takes 2 sec. No more .psd or .indd. Also no need of the slicing process (exporting assets from photoshop)
//- . the client wants to have a sneak peek at the layouts ? Just export the layout to dropbox and send the link.
//- . its quick - very quick
//-
//- - First result were very good. but … (there’s always a but)
//- - app becomes very hard to maintain as it grows complex
//- Hype is very good for playing with static content so we needed to find a way to inject some robust logic into it.
//- => we decided to look for a reactive library to structure our code.
//-
//- - Comparison between frameworks
//- . Angular needs a full control of the dom. React was a bit complex.
//- => That’s why we chose Vue.js
//-
//- - Vue.js
//- . onefile components (vueify)
//- . growing community
//- . plugins : vuex(redux), router,
//- . devote & hotmodule replacement
//- . v2.0 is coming
//- - exemple
//-
//- OUR WEBAPPS IN DETAILS
//-
//- - SPA (single page application)
//- . backend séparé du frontend - API
//- . les divers outils autour:
//-   devtools: gulp - browserify - babel
//-   router: custom,
//-   datastore: jsdata(like ember)
//-   apimocks: mockserver,
//-   icons: grunticon + component vue,
//-   ui components: custom and keen-ui,
//- . mustache to inject custom data
//- - Pros and cons
//- - cons:
//-   .performance,
//-   .seo,
//-   .gestion du git,
//-   .contenu qui peut être séparé à deux endroits
//-
//- - pros:
//-   .flexible
//-   .portable (you can get rid of hype if you want to at some point)
//-
//-
//- CONCLUSION
//-
//- As developers we always looking for new workflows to help us in our daily work. But sometimes it can time consuming, we easily spend 10 hours per week just to search, learn and evaluate new tools/technologies. In fact, frameworks, and tools are more than just a research of efficiency, they are shaping the way we produce and deal with technologies. From a teamwork perspective, workflow is mandatory. This is why its so important and why we wanted to share our philosophy and the structure we built upon it.
//-
//- Most of you, I guess, are working along designers, (or are designers also ) everyday. Although Javascript is getting in backend also, it has been a long time dedicated to front-end and ux. We’re not gonna talk about other aspect of javascript here.
//-
//-
//- Resources






</template>

<style lang="scss" scoped>
  @import "rallye/base/utils/vendors";
  @import "rallye/base/project/mixins";
  @import "rallye/base/project/variables";
  @import "animatewithsass/animate.scss";

  .accueil-scene {

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
