import store from 'data-store'

const Mot = store.defineResource({
  name: 'mot',
  endpoint: 'mots',
  suffix: '.json',
  basePath: 'https://dictionnaire.grandducenligne.com/api',
})

store.registerModel('Mot', Mot)

export default Mot
