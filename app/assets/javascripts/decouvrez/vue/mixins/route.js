import Router from 'hype/router'

export default {
  methods: {
    setState(state, params, merge = true) {
      if (merge) params = Object.assign({}, Router.getRouteParams(), params)
      Router.setState(state, params)
    },
    getUrlFromState(state, params, merge = true) {
      if (merge) params = Object.assign({}, Router.getRouteParams(), params)
      const url = Router.getUrlFromState(state, params)
      return url ? `#${url}` : window.location.href
    },
  },
  computed: {
    routeParams() {
      return Router.getRouteParams()
    },
  },
}
