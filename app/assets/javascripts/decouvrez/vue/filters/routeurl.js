import Router from 'hype/router'

export default function (state, ...args) {
  let url
  try {
    url = `#${Router.getUrlFromState(state, ...args)}`
  } catch (e) {
    console.warn(`Erreur: la route ${state} ${e.message}`);
  }
  return url
}
