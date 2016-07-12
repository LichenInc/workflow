
const pattern = /\*([A-zÀ-ÿ]+)\*/gi
const patternApi = /\[(.*)\]/gi

import { includes } from 'lodash'
import { remove as removeDiacritics } from 'diacritics'

export default function (phrase) {
  const matches = phrase.match(pattern).map(mot => mot.replace(/(\*)|(\[.*\])/gi, '')) || []

  const splits = phrase.split(pattern)
  return splits.map(mot => {
    const match = patternApi.exec(mot)
    const safeMot = mot.replace(/\[.*\]/gi, '')
    return {
      text: safeMot,
      api_mot: match && match.length ? match[1] : removeDiacritics(safeMot),
      is_dico: includes(matches, safeMot),
    }
  })
}
