import {variables_to_fetch, rallyeId} from 'configs/global'

var Rallye = require('models/rallye')

export const pollRallye = () => {
  return this.params.cat === 'default'
    ? Promise.resolve(mots)
    : Http.GET(`${process.env.MOT_API_URL}/${this.params.cat}.json`).then(data => data.data)
}
