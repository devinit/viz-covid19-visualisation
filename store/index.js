import axios from 'axios'
import config from '../nuxt.config'

export const state = () => ({
  useCache: false,
  IATISource: 'dportal',
  CORSAnywhere: "https://cors-anywhere.herokuapp.com/"
})

export const mutations = {
  toggleUseCache(state) {
    state.useCache = !(state.useCache)
  },
  setIATISource(state, source) {
    state.IATISource = source
  }
}

export const actions = {
}
